import { toast } from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import { useProductionContext } from './ProductionContext';
import { ArrowLeft, Download } from '@phosphor-icons/react';
import { uploadFile } from '@/app/actions/uploadFile';
import { JobParams } from '@/app/actions/apiInterface';
import { runAsyncRequestJob } from '@/app/actions/runAsyncRequestJob';
import { PlaygroundFile, ExtractState, ProcessType, JobType } from '@/app/types/PlaygroundTypes';
import { runAsyncRequestJob as runPreprodAsyncRequestJob } from '@/app/actions/preprod/runAsyncRequestJob';
import Button from '../Button';
import CodeBlock from '../CodeBlock';
import DocumentViewer from '../DocumentViewer';
import KeyValueInputs from './KeyValueInputs';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import ExtractKeyValuePairTutorial from '../tutorials/ExtractKeyValuePairTutorial';
import { useTranslation } from '@/lib/use-translation';
import { useAuth0 } from '@auth0/auth0-react';

const downloadExtractedData = (formattedData: string, file?: PlaygroundFile['file']) => {
  if (!formattedData) return;

  const fileName = file instanceof File ? file.name : 'extracted_data';
  const blob = new Blob([formattedData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const baseFileName = fileName.replace(/\.[^/.]+$/, '');
  a.download = `${baseFileName}_extracted.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const ExtractKeyValuePairContainer = () => {
  const [hideResult, setHideResult] = useState(false);
  const { apiURL, isProduction } = useProductionContext();
  const { selectedFileIndex, files, updateFileAtIndex, addFilesFormData, loggedIn, setPendingAction, getState } =
    usePlaygroundStore();
  const { t } = useTranslation();
  const { loginWithPopup } = useAuth0();

  const selectedFile = useMemo(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      return files[selectedFileIndex];
    }
  }, [selectedFileIndex, files]);

  useEffect(() => {
    if (!selectedFile) return;

    if (
      selectedFile.extractKeyValueState === ExtractState.EXTRACTING ||
      selectedFile.extractKeyValueState === ExtractState.UPLOADING
    ) {
      toast.loading(t.playground.extraction.extractingData, { id: 'key-value-extracting-toast' });
    } else {
      toast.dismiss('key-value-extracting-toast');
    }
  }, [selectedFile?.extractKeyValueState]);

  const handleSuccess = async (response: any) => {
    // Get fresh state values to avoid stale closure variables
    const state = getState();
    const currentSelectedFile = state.files[state.selectedFileIndex!];

    if (!response.data) {
      toast.error(
        `${currentSelectedFile?.file instanceof File ? currentSelectedFile.file.name : 'File'}: Received undefined result. Please try again.`
      );
      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
      return;
    }

    const formattedResult = JSON.stringify(response.data.json, null, 2);

    updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueResult', formattedResult);
    updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.DONE_EXTRACTING);

    toast.success('Extraction complete!');
  };

  const handleError = (error: any) => {
    // Get fresh state values to avoid stale closure variables
    const state = getState();

    if (error.response) {
      if (error.response.status === 429) {
        toast.error('Extract limit reached.');
        updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.LIMIT_REACHED);
      } else {
        toast.error('Extraction failed. Please try again.');
        updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
      }
    } else {
      toast.error('Error during extraction. Please try again.');
      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
    }
    console.error(error);
  };

  const handleTimeout = () => {
    // Get fresh state values to avoid stale closure variables
    const state = getState();
    updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
    toast.error('Extract request timed out. Please try again.');
  };

  const onSubmit = async (extractInstruction: Record<string, string>) => {
    if (!loggedIn) {
      // Save current state so we can resume after login
      localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);

      // Set pending action to continue extraction after login with fresh values
      setPendingAction(async () => {
        // Get fresh state when executed
        const state = getState();

        // Execute with fresh values directly
        await onSubmitWithFreshState(extractInstruction, state);
      });

      // Trigger login flow
      loginWithPopup({
        authorizationParams: {
          scope: 'openid profile email',
        },
      });
      return;
    }

    // Execute extraction directly if already logged in
    await onSubmitWithFreshState(extractInstruction, getState());
  };

  const onSubmitWithFreshState = async (extractInstruction: Record<string, string>, state: any) => {
    const currentSelectedFile = state.files[state.selectedFileIndex!];
    const currentToken = state.token;
    const currentUserId = state.userId;
    const currentClientId = state.clientId;

    if (!currentSelectedFile?.file) {
      toast.error('Please select a file first');
      return;
    }

    if (state.selectedFileIndex === null) {
      toast.error('No file selected');
      return;
    }

    try {
      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.UPLOADING);
      const file = currentSelectedFile.file;

      const jobParams: JobParams = {
        vqaProcessorArgs: {
          vqaExtractInstruction: extractInstruction,
        },
      };

      // Upload file and get presigned url and metadata
      const uploadResult = await uploadFile({
        api_url: apiURL,
        userId: currentUserId,
        token: currentToken,
        file: file as File,
        process_type: ProcessType.EXTRACT_KEY_VALUE,
        extractArgs: {
          extractInstruction,
        },
        addFilesFormData,
      });

      if (uploadResult instanceof Error) {
        toast.error(t.messages.error.uploadError);
        updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
        return;
      }

      const fileData = uploadResult.data;
      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.EXTRACTING);

      // Common job parameters
      const jobConfig = {
        apiURL,
        jobType: JobType.KEY_VALUE_EXTRACTION,
        userId: currentUserId,
        clientId: currentClientId,
        fileId: fileData.fileId,
        fileData,
        selectedFile: currentSelectedFile,
        token: currentToken,
        sourceType: 's3',
        jobParams,
        selectedFileIndex: state.selectedFileIndex,
        filename: file instanceof File ? file.name : 'file',
        handleError,
        handleSuccess,
        handleTimeout,
        updateFileAtIndex,
      } as const;

      // Run the async job based on environment
      const runJob = isProduction ? runAsyncRequestJob : runPreprodAsyncRequestJob;
      await runJob(jobConfig);
    } catch (error) {
      toast.error('Extraction failed. Please try again.');
      console.error(error);
      updateFileAtIndex(selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
    }
  };

  const fileUrl = useMemo(() => {
    if (!selectedFile?.file) return '';
    if (typeof selectedFile.file === 'string') return selectedFile.file;
    return URL.createObjectURL(selectedFile.file);
  }, [selectedFile?.file]);

  return (
    <div className="h-full w-full pt-4 relative">
      <div className="w-[calc(90%-11rem)] h-full">
        <ExtractKeyValuePairTutorial />
        {fileUrl && (hideResult || !selectedFile?.extractKeyValueResult) && (
          <div className="h-full">
            <DocumentViewer
              fileType={selectedFile?.file instanceof File ? selectedFile.file.type : 'pdf'}
              fileUrl={fileUrl}
            />
            {selectedFile?.extractKeyValueResult && (
              <div className="absolute bottom-4 left-4">
                <Button
                  label={t.playground.extraction.backToResult}
                  labelIcon={ArrowLeft}
                  onClick={() => setHideResult(false)}
                />
              </div>
            )}
          </div>
        )}
        {!hideResult && selectedFile?.extractKeyValueResult && (
          <div className="pb-24">
            <CodeBlock language="json" code={selectedFile?.extractKeyValueResult} aria-label="Extraction Result" />
            <div className="absolute bottom-4 left-4 flex gap-2 w-fit">
              <Button
                label={t.playground.extraction.backToFile}
                labelIcon={ArrowLeft}
                onClick={() => setHideResult(true)}
              />
              <Button
                label={t.playground.extraction.download}
                labelIcon={Download}
                onClick={() => downloadExtractedData(selectedFile?.extractKeyValueResult, selectedFile?.file)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="h-[calc(100%-1rem)] max-w-72 w-[30%] p-4 rounded-2xl shadow-[0px_0px_4px_2px_rgba(0,_0,_0,_0.1)] absolute top-4 right-0">
        <div className="w-full max-h-full overflow-hidden flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <KeyValueInputs
              onSubmit={onSubmit}
              isLoading={
                selectedFile?.extractKeyValueState === ExtractState.EXTRACTING ||
                selectedFile?.extractKeyValueState === ExtractState.UPLOADING
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractKeyValuePairContainer;
