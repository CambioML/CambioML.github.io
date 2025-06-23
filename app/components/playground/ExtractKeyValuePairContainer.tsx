import { toast } from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import { useProductionContext } from './ProductionContext';
import { ArrowLeft, Download } from '@phosphor-icons/react';
import { asyncExtractKeyValue, pollJobStatus } from '@/app/actions/async_processor';
import { PlaygroundFile, ExtractState } from '@/app/types/PlaygroundTypes';
import Button from '../Button';
import CodeBlock from '../CodeBlock';
import DocumentViewer from '../DocumentViewer';
import KeyValueInputs from './KeyValueInputs';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import useAccountStore from '@/app/hooks/useAccountStore';
import ExtractKeyValuePairTutorial from '../tutorials/ExtractKeyValuePairTutorial';
import QuotaLimitPage from './QuotaLimitPage';
import { useTranslation } from '@/lib/use-translation';
import { useAuth0 } from '@auth0/auth0-react';
import { checkQuota } from '@/app/actions/account/ApiKey';

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
  const { apiURL } = useProductionContext();
  const {
    selectedFileIndex,
    files,
    updateFileAtIndex,
    loggedIn,
    setPendingAction,
    getState,
    pendingAction,
    remainingQuota,
    loadingQuota,
    setRemainingQuota,
  } = usePlaygroundStore();
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

  const onSubmit = async (extractInstruction: Record<string, string>) => {
    if (!loggedIn) {
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
    const { apiKeys } = useAccountStore.getState();

    if (!currentSelectedFile?.file) {
      toast.error('Please select a file first');
      return;
    }

    if (state.selectedFileIndex === null) {
      toast.error('No file selected');
      return;
    }

    const apiKey = apiKeys && apiKeys.length > 0 ? apiKeys[0].api_key : null;
    if (!apiKey) {
      toast.error('No API key found. Please generate an API key in your account settings.');
      return;
    }

    try {
      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.UPLOADING);
      const file = currentSelectedFile.file as File;

      // Convert extractInstruction to key-description pairs format
      const extractInputKeyDescriptionPairs = Object.entries(extractInstruction).map(([key, description]) => ({
        key,
        description: description || key,
      }));

      // Submit the async job
      const jobResponse = await asyncExtractKeyValue({
        api_url: apiURL,
        file,
        apiKey,
        extractInputKeyDescriptionPairs,
      });

      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.EXTRACTING);

      // Poll for results
      const result = await pollJobStatus(apiURL, jobResponse.job_id, apiKey);

      if (result.status === 'completed') {
        if (result.result) {
          const formattedResult = JSON.stringify(result.result, null, 2);
          updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueResult', formattedResult);
          updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.DONE_EXTRACTING);
          toast.success('Extraction complete!');

          // Update quota after successful extraction
          try {
            const quotaResponse = await checkQuota({ apiKey, apiURL });
            setRemainingQuota(quotaResponse.remaining_quota);
          } catch (error) {
            console.error('Error checking quota after extraction:', error);
          }
        } else if (result.result_url) {
          // Handle case where result is provided via URL
          try {
            const resultResponse = await fetch(result.result_url);
            const resultData = await resultResponse.json();
            const formattedResult = JSON.stringify(resultData, null, 2);
            updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueResult', formattedResult);
            updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.DONE_EXTRACTING);
            toast.success('Extraction complete!');

            // Update quota after successful extraction
            try {
              const quotaResponse = await checkQuota({ apiKey, apiURL });
              setRemainingQuota(quotaResponse.remaining_quota);
            } catch (error) {
              console.error('Error checking quota after extraction:', error);
            }
          } catch (error) {
            console.error('Error fetching result from URL:', error);
            toast.error('Error retrieving extraction results. Please try again.');
            updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
          }
        } else {
          toast.error('No extraction result found. Please try again.');
          updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
        }
      } else if (result.status === 'failed') {
        toast.error(result.error_message || 'Extraction failed. Please try again.');
        updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
      }
    } catch (error) {
      toast.error('Extraction failed. Please try again.');
      console.error(error);
      updateFileAtIndex(state.selectedFileIndex, 'extractKeyValueState', ExtractState.READY);
    }
  };

  const fileUrl = useMemo(() => {
    if (!selectedFile?.file) return '';
    if (typeof selectedFile.file === 'string') return selectedFile.file;
    return URL.createObjectURL(selectedFile.file);
  }, [selectedFile?.file]);

  return (
    <>
      {selectedFile?.extractKeyValueState === ExtractState.LIMIT_REACHED ||
      (selectedFile?.extractKeyValueState !== ExtractState.DONE_EXTRACTING &&
        loggedIn &&
        remainingQuota <= 0 &&
        !loadingQuota) ? (
        <QuotaLimitPage />
      ) : (
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
              <div className="flex flex-col items-start w-full h-full gap-4 p-4">
                <div className="flex-1 w-full overflow-auto overscroll-contain">
                  <CodeBlock
                    language="json"
                    code={selectedFile?.extractKeyValueResult}
                    aria-label="Extraction Result"
                  />
                </div>
                <div className="w-full h-fit flex gap-2">
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
          <div className="h-[calc(100%-1rem)] max-w-72 w-[30%] p-4 rounded-2xl shadow-md absolute top-4 right-0">
            <div className="w-full h-full overflow-hidden flex flex-col gap-2">
              <KeyValueInputs
                onSubmit={onSubmit}
                isLoading={
                  selectedFile?.extractKeyValueState === ExtractState.EXTRACTING ||
                  selectedFile?.extractKeyValueState === ExtractState.UPLOADING ||
                  !!pendingAction
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtractKeyValuePairContainer;
