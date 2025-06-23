import Button from '../Button';
import toast from 'react-hot-toast';
import PulsingIcon from '../PulsingIcon';
import ResultContainer from './ResultContainer';
import QuotaLimitPage from './QuotaLimitPage';
import ModelToggleDropdown from './ModelToggleDropdown';
import ExtractSettingsChecklist from './ExtractSettingsChecklist';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import JSZip from 'jszip'; // Import JSZip for zipping files
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { downloadFile } from '@/app/actions/downloadFile';
import { runAsyncRequestJob } from '@/app/actions/runAsyncRequestJob';
import { JobParams } from '@/app/actions/apiInterface';
import { useProductionContext } from './ProductionContext';
import { usePostHog } from 'posthog-js/react';
import { uploadFile, asyncParseFile, pollJobStatus } from '@/app/actions/uploadFile';
import { runSyncExtract } from '@/app/actions/runSyncExtract';
import { extractPageAsBase64 } from '@/app/helpers';
import { extractImageLinks } from '@/app/helpers';
import { useTranslation } from '@/lib/use-translation';
import { useRouter } from 'next/navigation';
import { usePopupAuth } from '@/app/hooks/usePopupAuth';
import { DownloadSimple, CloudArrowUp, ArrowCounterClockwise, FileText } from '@phosphor-icons/react';
import { PlaygroundFile, ExtractState, ExtractTab, ProcessType, ModelType } from '@/app/types/PlaygroundTypes';
import { runAsyncRequestJob as runPreprodAsyncRequestJob } from '@/app/actions/preprod/runAsyncRequestJob';
import { useAmplifyAuth } from '@/app/hooks/useAmplifyAuth';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import useAccountStore from '@/app/hooks/useAccountStore';
import { checkApiKey } from '@/app/actions/account/ApiKey';
import getApiKey from '@/app/actions/account/ApiKey';

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
    pendingAction,
    setToken,
    setLoggedIn,
    setUserId,
    setClientId,
    executePendingAction,
  } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const posthog = usePostHog();
  const resultZoomModal = useResultZoomModal();
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Get Amplify auth state and tokens
  const { tokens, userAttributes, refreshTokens, isAuthenticated, loading } = useAmplifyAuth();
  const { apiKeys, setApiKeys } = useAccountStore();

  // Add popup auth hook
  const { openAuthPopup, isLoading: authLoading } = usePopupAuth({
    onSuccess: async () => {
      try {
        // Wait a moment for the auth state to propagate
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Manually refresh tokens and attributes from the parent window context
        // This is necessary because the popup authentication happens in a separate window
        await refreshTokens();

        // Wait a bit more for the refresh to complete
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get fresh tokens directly from Amplify after refresh
        const { tokens: freshTokens } = await fetchAuthSession();
        const freshUserAttributes = await fetchUserAttributes();

        // Log the complete JWT token for debugging
        if (freshTokens?.idToken) {
          console.log('Complete JWT ID Token:', freshTokens.idToken.toString());
        }
        if (freshTokens?.accessToken) {
          console.log('Complete JWT Access Token:', freshTokens.accessToken.toString());
        }

        // Get the fresh tokens after successful authentication
        if (freshTokens?.idToken) {
          setToken(freshTokens.idToken.toString());
          setLoggedIn(true);

          // Set user ID from user attributes if available
          if (freshUserAttributes?.email) {
            setUserId(freshUserAttributes.email);
          }

          // Set client ID (this would be the Cognito client ID for Amplify)
          setClientId(process.env.NEXT_PUBLIC_COGNITO_APPCLIENT_ID || '');
          toast.success('Authentication successful');

          // Execute pending action after syncing auth state
          executePendingAction();
        } else {
          console.error('Authentication failed: No ID token available');
          toast.error('Authentication succeeded but token not available. Please try again.');
        }
      } catch (error) {
        console.error('Error processing authentication success:', error);
        toast.error('Authentication succeeded but failed to sync state. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Authentication failed:', error);
      toast.error('Authentication failed. Please try again.');
    },
  });

  // Synchronize playground store with Amplify auth state
  useEffect(() => {
    if (isAuthenticated && tokens.idToken && userAttributes.email) {
      // Update playground store with current auth state
      setToken(tokens.idToken);
      setLoggedIn(true);
      setUserId(userAttributes.email);
      setClientId(process.env.NEXT_PUBLIC_COGNITO_APPCLIENT_ID || '');
    } else if (!isAuthenticated) {
      // Clear playground store when not authenticated
      setToken('');
      setLoggedIn(false);
      setUserId('');
      setClientId('');
    }
  }, [isAuthenticated, tokens.idToken, userAttributes.email, setToken, setLoggedIn, setUserId, setClientId]);

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
    // Get fresh state values to avoid stale closure variables
    const state = getState();
    const currentUserId = state.userId;
    const currentToken = state.token;
    const currentClientId = state.clientId;
    const currentModelType = state.modelType;

    // Check if we have a valid selected file index
    if (state.selectedFileIndex === null) {
      toast.error('No file selected');
      return;
    }

    const currentSelectedFile = state.files[state.selectedFileIndex];

    if (!currentSelectedFile || !currentSelectedFile.file) {
      toast.error('No file selected');
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      setPendingAction(() => handleExtract);
      openAuthPopup();
      return;
    }

    // Get API key
    const apiKey = apiKeys && apiKeys.length > 0 ? apiKeys[0].api_key : null;
    if (!apiKey) {
      toast.error('No API key available. Please visit your account page to generate one.');
      return;
    }

    updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.EXTRACTING);

    try {
      // Use the new async parse endpoint
      const parseResponse = await asyncParseFile({
        api_url: apiURL,
        file: currentSelectedFile.file as File,
        apiKey: apiKey,
      });

      toast.success('File submitted for processing...');

      // Poll for job completion
      const jobResult = await pollJobStatus(
        apiURL,
        parseResponse.job_id,
        apiKey,
        30, // max attempts
        2000 // poll interval (2 seconds)
      );

      if (jobResult.status === 'completed') {
        let extractedContent = '';

        // Handle result from presigned URL or inline result
        if (jobResult.result_url) {
          // Fetch result from presigned URL
          const resultResponse = await fetch(jobResult.result_url);
          const resultData = await resultResponse.json();
          extractedContent = resultData.markdown || resultData.result || JSON.stringify(resultData);
        } else if (jobResult.result) {
          // Use inline result
          extractedContent = jobResult.result.markdown || jobResult.result.result || JSON.stringify(jobResult.result);
        }

        // Update file with extracted content
        updateFileAtIndex(state.selectedFileIndex, 'extractResult', [extractedContent]);
        updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);

        toast.success('File extracted successfully!');

        // Analytics
        if (isProduction) {
          posthog.capture('playground.plain_text.extract_success', {
            route: '/playground',
            module: 'plain_text',
            file_type: getFileType(),
            model_type: currentModelType,
          });
        }
      } else if (jobResult.status === 'failed') {
        const errorMessage = jobResult.error_message || 'Extraction failed';
        toast.error(errorMessage);
        updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.READY);

        // Analytics
        if (isProduction) {
          posthog.capture('playground.plain_text.extract_error', {
            route: '/playground',
            module: 'plain_text',
            file_type: getFileType(),
            error: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error('Error during extraction:', error);
      toast.error('Extraction failed. Please try again.');
      updateFileAtIndex(state.selectedFileIndex, 'extractState', ExtractState.READY);

      // Analytics
      if (isProduction) {
        posthog.capture('playground.plain_text.extract_error', {
          route: '/playground',
          module: 'plain_text',
          file_type: getFileType(),
          error: error instanceof Error ? error.message : 'Unknown error',
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

        // Get fresh state values to avoid stale closure variables
        const state = getState();
        const currentToken = state.token;
        const currentExtractSettings = state.extractSettings;

        const newMarkdown = await runSyncExtract({
          token: currentToken,
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
      }
    } else {
      console.warn('Selected file is not valid or is missing.');
    }
  };

  // Add API key loading logic similar to AccountPageContainer
  useEffect(() => {
    const checkAndFetchApiKeys = async () => {
      if (!isAuthenticated || !tokens.idToken || !userAttributes.userId || apiKeys.length > 0) {
        return;
      }

      try {
        // First check if API key exists using JWT token
        const checkResult = await checkApiKey({
          token: tokens.idToken,
          apiURL,
        });

        // Only fetch API key if checkResult indicates an API key exists
        if (checkResult) {
          // Now fetch the actual API key details
          const existingApiKey = await getApiKey({
            token: tokens.idToken,
            apiURL,
            email: userAttributes.email,
          });

          setApiKeys([existingApiKey]);
        } else {
          console.log('Playground: No API key exists for this user');
        }
      } catch (error) {
        console.log('Playground: No existing API key found or error checking:', error);
      }
    };

    checkAndFetchApiKeys();
  }, [
    isAuthenticated,
    tokens.idToken,
    userAttributes.userId,
    apiURL,
    userAttributes.email,
    apiKeys.length,
    setApiKeys,
  ]);

  return (
    <>
      {selectedFile?.extractState === ExtractState.LIMIT_REACHED ||
      (selectedFile?.extractState !== ExtractState.DONE_EXTRACTING &&
        isAuthenticated &&
        remainingQuota <= 0 &&
        !loadingQuota) ? (
        <QuotaLimitPage />
      ) : (
        <>
          {selectedFile?.extractState === ExtractState.READY && (
            <div className="flex flex-col h-full justify-center items-center text-lg text-center gap-4">
              <div className="flex flex-col items-center justify-center">
                <span id="extract-file-name">{filename}</span>

                <div className="flex flex-col gap-4 items-center justify-center mt-1">
                  {/* Extract button below */}
                  <div className="w-fit">
                    <Button
                      label={t.playground.extraction.extractPlainText}
                      onClick={() => handleExtract()}
                      small
                      labelIcon={FileText}
                      id="extract-plain-text-btn"
                      disabled={!!pendingAction || authLoading}
                    />
                  </div>
                  <ModelToggleDropdown />
                </div>
                <div className="w-full mt-4">
                  <ExtractSettingsChecklist removePIIOnly={isProduction} />
                </div>
              </div>
            </div>
          )}
          {selectedFile?.extractState === ExtractState.UPLOADING && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="text-xl font-semibold text-neutral-500">{t.playground.extraction.uploading}</div>
              <PulsingIcon Icon={CloudArrowUp} size={40} />
            </div>
          )}
          {selectedFile?.extractState === ExtractState.EXTRACTING && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="text-xl font-semibold text-neutral-500">{t.playground.extraction.extracting}</div>
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
