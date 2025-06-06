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
import { useTranslation } from '@/lib/use-translation';
import { useAuth0 } from '@auth0/auth0-react';

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
    loggedIn,
    addFilesFormData,
    updateFileAtIndex,
    setTotalQuota,
    setRemainingQuota,
    remainingQuota,
    setPendingAction,
    loadingQuota,
    getState,
  } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const posthog = usePostHog();
  const resultZoomModal = useResultZoomModal();
  const { t } = useTranslation();
  const { loginWithPopup } = useAuth0();

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

  const getFileType = useCallback((): string => {
    let fileType = 'text/html';
    if (selectedFile?.file instanceof File) {
      fileType = selectedFile.file.type;
    }
    return fileType;
  }, [selectedFile?.file]);

  const handleDownload = useCallback(async () => {
    if (selectedFile?.extractResult) {
      // 1. case no image: just download markdown;
      // 2. case one or multiple images: download images and include them in zip;
      // todo: now only in pro, plain text, no table/basic. tdb
      const markdownContent = selectedFile.extractResult.join('\n\n');

      // Extract image links from markdown content
      const imageLinks = extractImageLinks(markdownContent);

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
          fileType: 'text/markdown',
          suffix: '_extracted.md',
        });
      }
    }
  }, [selectedFile, filename]);

  const handleError = useCallback(
    (e: AxiosError) => {
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
    },
    [filename, updateFileAtIndex, selectedFileIndex, isProduction, posthog, getFileType]
  );

  const handleSuccess = useCallback(
    async (response: AxiosResponse, targetPageNumbers?: number[]) => {
      // Get fresh state values to avoid stale closure variables
      const state = getState();
      const currentSelectedFile = state.files[state.selectedFileIndex!];
      const currentUserId = state.userId;
      const currentToken = state.token;

      let result = response.data.markdown;
      if (result === undefined) {
        toast.error(`${filename}: Received undefined result. Please try again.`);
        updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      }
      if (typeof result === 'string') {
        result = [result];
      }
      if (!isProduction) console.log('[MarkdownExtract] result:', result);
      if (targetPageNumbers) {
        const currentResult = currentSelectedFile?.extractResult;
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
      updateFileAtIndex(state.selectedFileIndex, 'extractResult', result);

      if (isProduction)
        posthog.capture('playground.plain_text.success', {
          route: '/playground',
          module: 'plain_text',
          file_type: getFileType(),
          num_pages: result.length,
        });
      updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);
      updateQuota({
        api_url: apiURL,
        userId: currentUserId,
        token: currentToken,
        setTotalQuota,
        setRemainingQuota,
        handleError,
      });
      toast.success(`${filename} extracted!`);
      return;
    },
    [
      getState,
      filename,
      isProduction,
      posthog,
      getFileType,
      updateFileAtIndex,
      apiURL,
      setTotalQuota,
      setRemainingQuota,
      handleError,
    ]
  );

  const handleTimeout = useCallback(() => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    toast.error(`Extract request for ${filename} timed out. Please try again.`);
  }, [updateFileAtIndex, selectedFileIndex, filename]);

  const handleExtract = async (targetPageNumbers?: number[]) => {
    const state = getState();
    console.log({ loggedIn, token: state.token });

    if (!loggedIn) {
      // Save current state so we can resume after login
      localStorage.setItem('auth_redirect_url', window.location.pathname + window.location.search);

      // Set pending action to continue extraction after login with fresh values
      setPendingAction(() => handleExtractAfterLogin(targetPageNumbers));

      // Trigger login flow
      loginWithPopup({
        authorizationParams: {
          scope: 'openid profile email',
        },
      });
      return;
    }

    // Execute extraction directly if already logged in
    await handleExtractAfterLogin(targetPageNumbers);
  };

  const handleExtractAfterLogin = useCallback(
    async (targetPageNumbers?: number[]) => {
      // Get fresh state values
      const state = getState();
      const currentSelectedFile = state.files[state.selectedFileIndex!];
      const currentToken = state.token;
      const currentUserId = state.userId;
      const currentClientId = state.clientId;
      const currentExtractSettings = state.extractSettings;
      const currentModelType = state.modelType;

      if (isProduction)
        posthog.capture('playground.plain_text.start_extract', {
          route: '/playground',
          module: 'plain_text',
          file_type: getFileType(),
        });
      if (currentSelectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
        updateFileAtIndex(state.selectedFileIndex, 'extractTab', ExtractTab.FILE_EXTRACT);
      }
      updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
      if (currentSelectedFile && state.selectedFileIndex !== null) {
        const jobParams: JobParams = {
          targetPageNumbers,
          maskPiiFlag: currentExtractSettings.removePII,
          vqaProcessorArgs: {
            vqaFiguresFlag: currentExtractSettings.includeChartsFigures,
            vqaChartsFlag: currentExtractSettings.includeChartsFigures,
            vqaTablesFlag: currentExtractSettings.includeTables,
            vqaFootnotesFlag: currentExtractSettings.includeFootnotes,
            vqaHeadersFlag: currentExtractSettings.includeHeadersFooters,
            vqaFootersFlag: currentExtractSettings.includeHeadersFooters,
            vqaPageNumsFlag: currentExtractSettings.includePageNumbers,
          },
        };
        let processType: ProcessType;
        if (currentModelType === ModelType.BASE) {
          processType = ProcessType.FILE_EXTRACTION;
        } else if (currentModelType === ModelType.PRO) {
          processType = ProcessType.FILE_EXTRACTION_PRO;
        } else if (currentModelType === ModelType.ULTRA) {
          processType = ProcessType.FILE_EXTRACTION_ULTRA;
        } else {
          toast.error('Invalid model type. Please try again.');
          updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.READY);
          return;
        }
        // get presigned url and metadata
        const uploadResult = await uploadFile({
          api_url: apiURL,
          userId: currentUserId,
          token: currentToken,
          file: currentSelectedFile.file as File,
          extractArgs: jobParams.vqaProcessorArgs || {},
          maskPiiFlag: jobParams.maskPiiFlag,
          process_type: processType,
          addFilesFormData,
        });
        if (uploadResult instanceof Error) {
          toast.error(t.messages.error.uploadError);
          updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.READY);
          return;
        }
        const fileData = uploadResult.data;

        if (!isProduction) console.log('[MarkdownExtract] jobParams:', jobParams);
        if (isProduction) {
          runAsyncRequestJob({
            apiURL: apiURL,
            jobType: 'info_extraction',
            userId: currentUserId,
            clientId: currentClientId,
            fileId: fileData.fileId,
            fileData,
            selectedFile: currentSelectedFile,
            token: currentToken,
            sourceType: 's3',
            jobParams,
            selectedFileIndex: state.selectedFileIndex,
            filename: currentSelectedFile.file instanceof File ? currentSelectedFile.file.name : 'file',
            handleError,
            handleSuccess,
            handleTimeout,
            updateFileAtIndex,
          });
        } else {
          runPreprodAsyncRequestJob({
            apiURL: apiURL,
            jobType: 'info_extraction',
            userId: currentUserId,
            clientId: currentClientId,
            fileId: fileData.fileId,
            fileData,
            selectedFile: currentSelectedFile,
            token: currentToken,
            sourceType: 's3',
            jobParams,
            selectedFileIndex: state.selectedFileIndex,
            filename: currentSelectedFile.file instanceof File ? currentSelectedFile.file.name : 'file',
            handleError,
            handleSuccess,
            handleTimeout,
            updateFileAtIndex,
          });
        }
      }
    },
    [
      getState,
      isProduction,
      posthog,
      getFileType,
      updateFileAtIndex,
      apiURL,
      addFilesFormData,
      handleError,
      handleSuccess,
      handleTimeout,
    ]
  );

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

        // Get fresh state values to avoid stale closure variables
        const state = getState();
        const currentUserId = state.userId;
        const currentToken = state.token;
        const currentExtractSettings = state.extractSettings;

        const newMarkdown = await runSyncExtract({
          token: currentToken,
          userId: currentUserId,
          apiUrl: apiURL,
          base64String: pageBase64,
          maskPii: currentExtractSettings.removePII,
          fileType: selectedFile.file.type,
        });
        const newResult = selectedFile.extractResult.slice();
        newResult[resultZoomModal.page] = newMarkdown;
        updateFileAtIndex(selectedFileIndex, 'extractResult', newResult);
      } catch (error) {
        console.error('Error during extraction:', error);
      } finally {
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);
        // Get fresh state values again for the final updateQuota call
        const state = getState();
        updateQuota({
          api_url: apiURL,
          userId: state.userId,
          token: state.token,
          setTotalQuota,
          setRemainingQuota,
          handleError,
        });
      }
    } else {
      console.warn('Selected file is not valid or is missing.');
    }
  };

  return (
    <>
      {selectedFile?.extractState === ExtractState.LIMIT_REACHED ||
      (selectedFile?.extractState !== ExtractState.DONE_EXTRACTING &&
        loggedIn &&
        remainingQuota === 0 &&
        !loadingQuota) ? (
        <QuotaLimitPage />
      ) : (
        <>
          {selectedFile?.extractState === ExtractState.READY && (
            <div className="flex flex-col h-full justify-center items-center text-lg text-center gap-4">
              <div className="flex flex-col items-center justify-center">
                <span id="extract-file-name">{filename}</span>

                {/* First row with two buttons side by side */}
                <div className="flex gap-4 items-center justify-center mt-8">
                  <ModelToggleDropdown />
                  <ExtractSettingsChecklist removePIIOnly={isProduction} />
                </div>

                {/* Extract button below */}
                <div className="w-fit mt-8">
                  <Button
                    label={t.playground.extraction.extractPlainText}
                    onClick={() => handleExtract()}
                    small
                    labelIcon={FileText}
                    id="extract-plain-text-btn"
                  />
                </div>
              </div>
            </div>
          )}
          {selectedFile?.extractState === ExtractState.UPLOADING && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className={textStyles}>{t.playground.extraction.uploading}</div>
              <PulsingIcon Icon={CloudArrowUp} size={40} />
            </div>
          )}
          {selectedFile?.extractState === ExtractState.EXTRACTING && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className={textStyles}>{t.playground.extraction.extracting}</div>
              <PulsingIcon Icon={FileText} size={40} />
            </div>
          )}
          {selectedFile?.extractState === ExtractState.DONE_EXTRACTING && (
            <div className="flex flex-col items-start w-full h-full gap-4 p-4">
              <ResultContainer extractResult={selectedFile.extractResult} />
              <div className="w-full h-fit flex gap-4">
                <Button
                  label={t.playground.extraction.reRunDocument}
                  onClick={handleRetry}
                  small
                  labelIcon={ArrowCounterClockwise}
                  id="retry-extract-btn"
                />
                {selectedFile.extractResult.length > 1 &&
                  selectedFile.file instanceof File &&
                  selectedFile.file.type === 'application/pdf' && (
                    <Button
                      label={t.playground.extraction.reRunPage.replace(
                        '{pageNumber}',
                        (resultZoomModal.page + 1).toString()
                      )}
                      onClick={handlePageRetry}
                      small
                      labelIcon={ArrowCounterClockwise}
                    />
                  )}
                <Button
                  label={t.playground.extraction.downloadMarkdown}
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
