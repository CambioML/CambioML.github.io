import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { PlaygroundFile, ExtractState, ExtractTab } from '@/app/types/PlaygroundTypes';
import { DownloadSimple, CloudArrowUp, ArrowCounterClockwise, FileText } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import { downloadFile } from '@/app/actions/downloadFile';
import { runRequestJob as runPreProdRequestJob } from '@/app/actions/preprod/runRequestJob';
import ResultContainer from './ResultContainer';
import { useProductionContext } from './ProductionContext';
import { usePostHog } from 'posthog-js/react';
import ExtractSettingsChecklist from './ExtractSettingsChecklist';
import { JobParams } from '@/app/actions/preprod/apiInterface';
import { runRequestJob } from '@/app/actions/runRequestJob';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';

const textStyles = 'text-xl font-semibold text-neutral-500';

export const extractMarkdownTables = (input: string): string[] => {
  const tableRegex = /\|(.*\|.+\|[\s\S]*\|.+\|)/gm;
  const match = input.match(tableRegex);

  return match || [];
};

const MarkdownExtractContainer = () => {
  const { isProduction, apiURL } = useProductionContext();
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex, token, clientId, extractSettings } =
    usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const posthog = usePostHog();
  const resultZoomModal = useResultZoomModal();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
      if (thisFile.file instanceof File) {
        setFilename(thisFile.file.name);
      } else {
        setFilename(thisFile.file);
      }
    }
  }, [selectedFileIndex, files]);

  const getFileType = (): string => {
    let fileType = 'text/html';
    if (selectedFile?.file instanceof File) {
      fileType = selectedFile.file.type;
    }
    return fileType;
  };

  const handleDownload = useCallback(() => {
    if (selectedFile?.extractResult) {
      if (isProduction)
        posthog.capture('playground.plain_text.download_markdown', {
          route: '/playground',
          module: 'plain_text',
          file_type: getFileType(),
        });
      downloadFile({
        filename,
        fileContent: selectedFile.extractResult.join('\n\n'),
        fileType: 'text/plain',
        suffix: '_extracted.txt',
      });
    }
  }, [selectedFile, filename]);

  const handleSuccess = (response: AxiosResponse, targetPageNumbers?: number[]) => {
    let result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      return;
    }
    if (typeof result === 'string') {
      result = [result];
    }
    if (!isProduction) console.log('[MarkdownExtract] result:', result);
    if (targetPageNumbers) {
      const currentResult = selectedFile?.extractResult;
      if (currentResult) {
        const newResult = currentResult.map((resultItem, index) => {
          if (targetPageNumbers.includes(index)) {
            return result.shift();
          } else {
            return resultItem;
          }
        });
        result = newResult;
      }
    }
    updateFileAtIndex(selectedFileIndex, 'extractResult', result);
    if (isProduction)
      posthog.capture('playground.plain_text.success', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
        num_pages: result.length,
      });
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);
    toast.success(`${filename} extracted!`);
    return;
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      }
    }
    if (isProduction)
      posthog.capture('playground.plain_text.error', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
        error_status: e.response?.status,
        error_message: e.response?.data,
      });
    toast.error(`Error extracting ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    toast.error(`Extract request for ${filename} timed out. Please try again.`);
  };

  const handleExtract = async (targetPageNumbers?: number[]) => {
    if (isProduction)
      posthog.capture('playground.plain_text.start_extract', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
      });
    if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
      updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.FILE_EXTRACT);
    }
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Please try again.`);
      return;
    }
    if (selectedFile && selectedFileIndex !== null) {
      const jobParams: JobParams = {
        targetPageNumbers,
        maskPiiFlag: extractSettings.removePII,
        vqaProcessorArgs: {
          vqaFiguresFlag: extractSettings.includeChartsFigures,
          vqaChartsFlag: extractSettings.includeChartsFigures,
          vqaTablesFlag: extractSettings.includeTables,
          vqaFootnotesFlag: extractSettings.includeFootnotes,
          vqaHeadersFlag: extractSettings.includeHeadersFooters,
          vqaFootersFlag: extractSettings.includeHeadersFooters,
          vqaPageNumsFlag: extractSettings.includePageNumbers,
        },
      };
      if (!isProduction) console.log('[MarkdownExtract] jobParams:', jobParams);
      if (isProduction) {
        runRequestJob({
          apiURL,
          fileId: fileData.fileId,
          clientId,
          token,
          sourceType: 's3',
          jobType: 'file_extraction',
          jobParams,
          selectedFileIndex,
          filename,
          handleError,
          handleSuccess,
          handleTimeout,
          updateFileAtIndex,
        });
      } else {
        runPreProdRequestJob({
          apiURL,
          fileId: fileData.fileId,
          clientId,
          token,
          sourceType: 's3',
          jobType: 'file_extraction',
          jobParams,
          selectedFileIndex,
          filename,
          handleError,
          handleSuccess,
          handleTimeout,
          updateFileAtIndex,
        });
      }
    }
  };

  const handleRetry = () => {
    updateFileAtIndex(selectedFileIndex, 'extractResult', []);
    if (isProduction)
      posthog.capture('playground.plain_text.retry', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
      });
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
  };

  const handlePageRetry = () => {
    if (isProduction)
      posthog.capture('playground.plain_text.page_retry', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
      });
    handleExtract([resultZoomModal.page]);
  };

  return (
    <>
      {selectedFile?.extractState === ExtractState.READY && (
        <div className="flex flex-col h-full justify-end items-center text-lg text-center gap-4 pb-4">
          <div className="flex flex-col items-center justify-center">
            {filename}
            <div className="w-[200px] mt-2">
              <Button label="Extract Plain Text" onClick={() => handleExtract()} small labelIcon={FileText} />
            </div>
          </div>
          <ExtractSettingsChecklist />
        </div>
      )}
      {selectedFile?.extractState === ExtractState.UPLOADING && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className={textStyles}>Uploading</div>
          <PulsingIcon Icon={CloudArrowUp} size={40} />
        </div>
      )}
      {selectedFile?.extractState === ExtractState.EXTRACTING && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className={textStyles}>Extracting</div>
          <PulsingIcon Icon={FileText} size={40} />
        </div>
      )}
      {selectedFile?.extractState === ExtractState.DONE_EXTRACTING && (
        <div className="flex flex-col items-start w-full h-full gap-4 p-4">
          <ResultContainer extractResult={selectedFile.extractResult} />
          <div className="w-full h-fit flex gap-4">
            <Button label="Re-run Document" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
            {selectedFile.extractResult.length > 1 && (
              <Button
                label={`Re-run Page ${resultZoomModal.page + 1}`}
                onClick={handlePageRetry}
                small
                labelIcon={ArrowCounterClockwise}
              />
            )}
            <Button
              label="Download Markdown"
              onClick={handleDownload}
              small
              disabled={selectedFile?.extractState !== ExtractState.DONE_EXTRACTING}
              labelIcon={DownloadSimple}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MarkdownExtractContainer;
