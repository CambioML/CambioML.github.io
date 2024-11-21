import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import axios, { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { PlaygroundFile, ExtractState, ExtractTab, ProcessType, ModelType } from '@/app/types/PlaygroundTypes';
import { DownloadSimple, CloudArrowUp, ArrowCounterClockwise, FileText } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import { downloadFile } from '@/app/actions/downloadFile';
import { runAsyncRequestJob } from '@/app/actions/runAsyncRequestJob';
import { JobParams } from '@/app/actions/apiInterface';
import { runAsyncRequestJob as runPreprodAsyncRequestJob } from '@/app/actions/preprod/runAsyncRequestJob';
import ResultContainer from './ResultContainer';
import { useProductionContext } from './ProductionContext';
import { usePostHog } from 'posthog-js/react';
import ExtractSettingsChecklist from './ExtractSettingsChecklist';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import QuotaLimitPage from './QuotaLimitPage';
import updateQuota from '@/app/actions/updateQuota';
import { uploadFile } from '@/app/actions/uploadFile';
import { runSyncExtract } from '@/app/actions/runSyncExtract';
import { extractPageAsBase64 } from '@/app/helpers';
import ModelToggleDropdown from './ModelToggleDropdown';
import JSZip from 'jszip'; // Import JSZip for zipping files
import { extractImageLinks } from '@/app/helpers';

const textStyles = 'text-xl font-semibold text-neutral-500';

export const extractMarkdownTables = (input: string): string[] => {
  const tableRegex = /\|(.*\|.+\|[\s\S]*\|.+\|)/gm;
  const match = input.match(tableRegex);

  return match || [];
};

const MarkdownExtractContainer = () => {
  const { isProduction, apiURL } = useProductionContext();
  const {
    selectedFileIndex,
    files,
    addFilesFormData,
    updateFileAtIndex,
    token,
    clientId,
    extractSettings,
    setTotalQuota,
    setRemainingQuota,
    remainingQuota,
    userId,
    modelType,
  } = usePlaygroundStore();
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

  const handleDownload = useCallback(async () => {
    if (selectedFile?.extractResult) {
      // 1. case no image: just download markdown;
      // 2. case one or multiple images: download images and include them in zip;
      // todo: now onlly in pro, plain text, no table/basic. tdb
      const markdownContent = selectedFile.extractResult.join('\n\n');

      // Extract image links from markdown content
      const imageLinks = extractImageLinks(markdownContent);

      // eslint-disable-next-line no-console
      // console.log('[MarkdownExtract] imageLinks:', imageLinks);

      if (imageLinks.length > 0) {
        // Download images and include them in zip
        const images = await Promise.all(
          imageLinks.map(async (link) => {
            try {
              const response = await axios.get(link.url, {
                responseType: 'blob',
                validateStatus: (status) => status === 200, // Only accept 200 status code
              });
              const blob = response.data;
              return { filename: link.filename, blob };
            } catch (error) {
              if (axios.isAxiosError(error)) {
                // eslint-disable-next-line no-console
                console.error(`Failed to fetch image from ${link.url}:`, error.message);
                // You might want to show this error to the user or handle it differently
              }
              // You might want to continue with other links even if one fails
              return null;
            }
          })
        );

        const zip = new JSZip();
        zip.file(filename + '_extracted.md', markdownContent);

        images.forEach((imageFile) => {
          if (imageFile) {
            zip.file(imageFile.filename, imageFile.blob);
          }
        });

        const zipContent = await zip.generateAsync({ type: 'blob' });
        const zipFilename = filename + '_extracted.zip';

        // Function to download blob
        const downloadBlob = (blob: Blob, filename: string) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        };

        downloadBlob(zipContent, zipFilename);
      } else {
        // No images, download markdown file as before
        downloadFile({
          filename,
          fileContent: markdownContent,
          fileType: 'text/plain',
          suffix: '_extracted.txt',
        });
      }
    }
  }, [selectedFile, filename]);

  const handleSuccess = async (response: AxiosResponse, targetPageNumbers?: number[]) => {
    let result = response.data.markdown;
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
    updateQuota({ api_url: apiURL, userId, token, setTotalQuota, setRemainingQuota, handleError });
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
      } else if (e.response.status === 429) {
        toast.error(`Extract page limit reached.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.LIMIT_REACHED);
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
      let processType: ProcessType;
      if (modelType === ModelType.BASE) {
        processType = ProcessType.FILE_EXTRACTION;
      } else if (modelType === ModelType.PRO) {
        processType = ProcessType.FILE_EXTRACTION_PRO;
      } else if (modelType === ModelType.ULTRA) {
        processType = ProcessType.FILE_EXTRACTION_ULTRA;
      } else {
        toast.error('Invalid model type. Please try again.');
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      }
      // get presigned url and metadata
      const uploadResult = await uploadFile({
        api_url: apiURL,
        userId,
        token,
        file: selectedFile.file as File,
        extractArgs: jobParams.vqaProcessorArgs || {},
        maskPiiFlag: jobParams.maskPiiFlag,
        process_type: processType,
        addFilesFormData,
      });
      if (uploadResult instanceof Error) {
        toast.error(`Error uploading ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      }
      const fileData = uploadResult.data;

      // eslint-disable-next-line no-console
      if (!isProduction) console.log('[MarkdownExtract] jobParams:', jobParams);
      if (isProduction) {
        runAsyncRequestJob({
          apiURL: apiURL,
          jobType: 'info_extraction',
          userId,
          clientId,
          fileId: fileData.fileId,
          fileData,
          selectedFile,
          token,
          sourceType: 's3',
          jobParams,
          selectedFileIndex,
          filename,
          handleError,
          handleSuccess,
          handleTimeout,
          updateFileAtIndex,
        });
      } else {
        runPreprodAsyncRequestJob({
          apiURL: apiURL,
          jobType: 'info_extraction',
          userId,
          clientId,
          fileId: fileData.fileId,
          fileData,
          selectedFile,
          token,
          sourceType: 's3',
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

  const handlePageRetry = async () => {
    if (isProduction)
      posthog.capture('playground.plain_text.page_retry', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
      });
    if (selectedFile && selectedFile.file instanceof File) {
      try {
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
        const pageBase64 = await extractPageAsBase64(selectedFile.file, resultZoomModal.page);

        const newMarkdown = await runSyncExtract({
          token: token,
          userId: userId,
          apiUrl: apiURL,
          base64String: pageBase64,
          maskPii: extractSettings.removePII,
          fileType: selectedFile.file.type,
        });
        const newResult = selectedFile.extractResult.slice();
        newResult[resultZoomModal.page] = newMarkdown;
        updateFileAtIndex(selectedFileIndex, 'extractResult', newResult);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error during extraction:', error);
      } finally {
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);
        updateQuota({ api_url: apiURL, userId, token, setTotalQuota, setRemainingQuota, handleError });
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn('Selected file is not valid or is missing.');
    }
  };

  return (
    <>
      {selectedFile?.extractState === ExtractState.LIMIT_REACHED ||
      (selectedFile?.extractState !== ExtractState.DONE_EXTRACTING && remainingQuota === 0) ? (
        <QuotaLimitPage />
      ) : (
        <>
          {selectedFile?.extractState === ExtractState.READY && (
            <div className="flex flex-col h-full justify-start items-center text-lg text-center gap-4 pt-[calc(20vh-120px)] lg:pt-[calc(30vh-120px)]">
              <div className="flex flex-col items-center justify-center">
                <span id="extract-file-name">{filename}</span>
                <div className="w-[200px] mt-2">
                  <Button
                    label="Extract Plain Text"
                    onClick={() => handleExtract()}
                    small
                    labelIcon={FileText}
                    id="extract-plain-text-btn"
                  />
                </div>
              </div>
              <ModelToggleDropdown />
              <ExtractSettingsChecklist removePIIOnly={isProduction} />
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
            <div className="flex flex-col items-start w-full h-full gap-4 p-4 overflow-hidden">
              <ResultContainer extractResult={selectedFile.extractResult} />
              <div className="w-full h-fit flex gap-4">
                <Button
                  label="Re-run Document"
                  onClick={handleRetry}
                  small
                  labelIcon={ArrowCounterClockwise}
                  id="retry-extract-btn"
                />
                {selectedFile.extractResult.length > 1 &&
                  selectedFile.file instanceof File &&
                  selectedFile.file.type === 'application/pdf' && (
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
      )}
    </>
  );
};

export default MarkdownExtractContainer;
