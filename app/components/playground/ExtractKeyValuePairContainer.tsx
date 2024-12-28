import { toast } from 'react-hot-toast';
import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Download } from '@phosphor-icons/react';
import { PlaygroundFile, ExtractState, ProcessType, JobType } from '@/app/types/PlaygroundTypes';
import { useProductionContext } from './ProductionContext';
import { uploadFile } from '@/app/actions/uploadFile';
import { runAsyncRequestJob } from '@/app/actions/runAsyncRequestJob';
import { runAsyncRequestJob as runPreprodAsyncRequestJob } from '@/app/actions/preprod/runAsyncRequestJob';
import { JobParams } from '@/app/actions/apiInterface';
import Button from '../Button';
import CodeBlock from '../CodeBlock';
import DocumentViewer from '../DocumentViewer';
import KeyValueInputs from './KeyValueInputs';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import ExtractKeyValuePairTutorial from '../tutorials/ExtractKeyValuePairTutorial';

const isEmptyExtractResult = (result?: string[] | null): boolean => {
  if (!result) return true;
  if (result.length === 0) return true;
  if (result.length === 1 && result[0] === '') return true;
  return false;
};

const getFileUrl = (file: PlaygroundFile) => {
  if (!file.file) return '';
  if (typeof file.file === 'string') return file.file;
  return URL.createObjectURL(file.file);
};

const shouldShowDocumentViewer = (file: PlaygroundFile | null): boolean => {
  return !!file && isEmptyExtractResult(file.extractResult);
};

const getDocumentViewerProps = (file: PlaygroundFile | null) => {
  if (!file) return null;
  return {
    fileType: file.file instanceof File ? file.file.type : 'text/plain',
    fileUrl: getFileUrl(file)
  };
};

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
  const { apiURL, isProduction } = useProductionContext();
  const { selectedFileIndex, files, updateFileAtIndex, token, userId, clientId, addFilesFormData } = usePlaygroundStore();
  const [loadingToastId, setLoadingToastId] = useState<string | undefined>();

  const selectedFile = useMemo(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      return files[selectedFileIndex];
    }
    return null;
  }, [selectedFileIndex, files]);

  // Memoize document viewer state to prevent re-renders when key-value inputs change
  const documentViewerState = useMemo(() => {
    if (!selectedFile) return null;

    const shouldShow = shouldShowDocumentViewer(selectedFile);
    if (!shouldShow) return null;

    return {
      shouldShow,
      props: getDocumentViewerProps(selectedFile)
    };
  }, [selectedFile?.file, selectedFile?.extractResult]); // Only depend on file and extractResult

  useEffect(() => {
    if (!selectedFile) return;

    if (selectedFile.keyValueExtractState === ExtractState.EXTRACTING || selectedFile.keyValueExtractState === ExtractState.UPLOADING) {
      if (!loadingToastId) {
        const id = toast.loading('Extracting data...');
        setLoadingToastId(id);
      }
    } else {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
        setLoadingToastId(undefined);
      }
    }
  }, [selectedFile?.keyValueExtractState, loadingToastId]);

  const handleSuccess = async (response: any) => {
    if (!response.data) {
      toast.error(`${selectedFile?.file instanceof File ? selectedFile.file.name : 'File'}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'extractResult', response.data);
    updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.DONE_EXTRACTING);
    toast.success('Extraction complete!');
  };

  const handleError = (error: any) => {
    if (error.response) {
      if (error.response.status === 429) {
        toast.error('Extract limit reached.');
        updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.LIMIT_REACHED);
      } else {
        toast.error('Extraction failed. Please try again.');
        updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.READY);
      }
    } else {
      toast.error('Error during extraction. Please try again.');
      updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.READY);
    }
    console.error(error);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.READY);
    toast.error('Extract request timed out. Please try again.');
  };

  const onSubmit = async (extractInstruction: Record<string, string>) => {
    if (!selectedFile?.file) {
      toast.error('Please select a file first');
      return;
    }

    if (selectedFileIndex === null) {
      toast.error('No file selected');
      return;
    }

    let loadingToast: string | undefined = undefined;
    try {
      updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.UPLOADING);
      const file = selectedFile.file;

      const jobParams: JobParams = {
        vqaProcessorArgs: {
          vqaExtractInstruction: extractInstruction
        }
      };

      // Upload file and get presigned url and metadata
      const uploadResult = await uploadFile({
        api_url: apiURL,
        userId,
        token,
        file: file as File,
        process_type: ProcessType.EXTRACT_KEY_VALUE,
        extractArgs: {
          extractInstruction
        },
        addFilesFormData,
      });

      if (uploadResult instanceof Error) {
        toast.error('Error uploading file. Please try again.');
        updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.READY);
        return;
      }

      const fileData = uploadResult.data;
      updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.EXTRACTING);

      // Common job parameters
      const jobConfig = {
        apiURL,
        jobType: JobType.KEY_VALUE_EXTRACTION,
        userId,
        clientId,
        fileId: fileData.fileId,
        fileData,
        selectedFile,
        token,
        sourceType: 's3',
        jobParams,
        selectedFileIndex,
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
      updateFileAtIndex(selectedFileIndex, 'keyValueExtractState', ExtractState.READY);
    }
  };

  const formattedExtractResult = useMemo(() => {
    if (!selectedFile || selectedFile.extractResult === null) return '';
    if (JSON.stringify(selectedFile?.extractResult) === '[""]') return '';
    
    try {
      const content = typeof selectedFile.extractResult === 'string'
        ? JSON.parse(selectedFile.extractResult)
        : selectedFile.extractResult;

      // The structure is always { json: [...] }
      if (!content.json || !Array.isArray(content.json)) {
        console.error('Invalid extract result structure:', content);
        return '';
      }

      return JSON.stringify(content.json[0], null, 2);
    } catch (error) {
      console.error('Error formatting extract result:', error);
      return '';
    }
  }, [selectedFile?.extractResult]);


  return (
    <div className="h-full w-full pt-4 relative">
      <div className="w-[calc(90%-11rem)] h-full overflow-auto overscroll-contain">
        <ExtractKeyValuePairTutorial />
        {documentViewerState?.shouldShow && (
          <DocumentViewer 
            {...documentViewerState.props!}
          />
        )}
        {selectedFile?.extractResult && !isEmptyExtractResult(selectedFile?.extractResult) && (
          <div className="pb-24">
            <CodeBlock 
              language="json" 
              code={formattedExtractResult}
              aria-label="Extraction Result"
            />
            <div className="absolute bottom-4 left-4 flex gap-2 w-fit">
              <Button 
                label="Back to File"
                labelIcon={ArrowLeft}
                onClick={() => {
                  updateFileAtIndex(selectedFileIndex, 'extractResult', []);
                }} 
              />
              <Button 
                label="Download" 
                labelIcon={Download} 
                onClick={() => downloadExtractedData(formattedExtractResult, selectedFile?.file)} 
              />
            </div>
          </div>
        )}
      </div>
      <div className="h-[calc(100%-1rem)] min-w-60 max-w-72 w-[18vw] p-4 rounded-2xl shadow-[0px_0px_4px_2px_rgba(0,_0,_0,_0.1)] absolute top-4 right-0">
        <div className="w-full max-h-full overflow-hidden flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <KeyValueInputs 
              onSubmit={onSubmit}
              isLoading={selectedFile?.keyValueExtractState === ExtractState.EXTRACTING || selectedFile?.keyValueExtractState === ExtractState.UPLOADING}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractKeyValuePairContainer;
