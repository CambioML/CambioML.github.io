import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractTab, PlaygroundFile, ExtractState, TableTab, ProcessType } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import Button from '../../Button';
import { ArrowCounterClockwise, ArrowRight, DownloadSimple, Table } from '@phosphor-icons/react';
import PulsingIcon from '../../PulsingIcon';
import toast from 'react-hot-toast';
import { downloadFile } from '@/app/actions/downloadFile';
import { AxiosError, AxiosResponse } from 'axios';
import ResultContainer from '../ResultContainer';
import { useProductionContext } from '../ProductionContext';
import { runAsyncRequestJob as runPreprodAsyncRequestJob } from '@/app/actions/preprod/runAsyncRequestJob';
import { usePostHog } from 'posthog-js/react';
import ExtractSettingsChecklist from '../ExtractSettingsChecklist';
import { JobParams } from '@/app/actions/apiInterface';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import DropdownButton from '../../inputs/DropdownButton';
import QuotaLimitPage from '../QuotaLimitPage';
import updateQuota from '@/app/actions/updateQuota';
import { uploadFile } from '@/app/actions/uploadFile';
import { runAsyncRequestJob } from '@/app/actions/runAsyncRequestJob';
import { extractPageAsBase64 } from '@/app/helpers';
import { runSyncTableExtract } from '@/app/actions/runSyncTableExtract';
import * as XLSX from 'xlsx';

const noPageContent = '<div>No table detected in output.</div>';

const TableExtractContainer = () => {
  const { apiURL, isProduction } = useProductionContext();
  const {
    selectedFileIndex,
    files,
    updateFileAtIndex,
    token,
    clientId,
    extractSettings,
    userId,
    setRemainingQuota,
    setTotalQuota,
    remainingQuota,
    addFilesFormData,
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
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const handleSuccess = (response: AxiosResponse, targetPageNumbers?: number[]) => {
    let result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
      return;
    }
    if (result['markdown'] === undefined) {
      toast.error(`${filename}: Received undefined markdown. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
      return;
    }
    result = result['markdown'].map((pageContent: string) => {
      if (pageContent.length === 0) return noPageContent;
      return pageContent;
    });
    if (isProduction)
      posthog.capture('playground.table.extract_table.success', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
        num_pages: result.length,
      });

    if (!isProduction) console.log('[TableExtract] result:', result);
    if (targetPageNumbers) {
      const currentResult = selectedFile?.tableExtractResult;
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
    updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.DONE_EXTRACTING);
    updateFileAtIndex(selectedFileIndex, 'tableExtractResult', result);
    updateQuota({ api_url: apiURL, userId: userId, token, setTotalQuota, setRemainingQuota, handleError });
    toast.success(`Generated table(s) from ${filename}!`);
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
        return;
      } else if (e.response.status === 429) {
        toast.error(`Extract page limit reached.`);
        updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.LIMIT_REACHED);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
        return;
      }
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.error', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
        error_status: e.response?.status,
        error_message: e.response?.data,
      });
    toast.error(`Error transforming ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
    toast.error(`Transform request for ${filename} timed out. Please try again.`);
  };

  const handleTableExtractTransform = async (targetPageNumbers?: number[]) => {
    if (isProduction)
      posthog.capture('playground.table.extract_table.start_extract', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
      updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.TABLE_EXTRACT);
    }
    updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.EXTRACTING);

    if (selectedFileIndex === null || !selectedFile) {
      toast.error(`Error extracting ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
      return;
    }
    const jobParams: JobParams = {
      targetPageNumbers,
      maskPiiFlag: extractSettings.removePII,
    };
    // get presigned url and metadata
    const uploadResult = await uploadFile({
      api_url: apiURL,
      userId,
      token,
      file: selectedFile.file as File,
      extractArgs: jobParams.vqaProcessorArgs || {},
      maskPiiFlag: extractSettings.removePII,
      process_type: ProcessType.TABLE_EXTRACTION,
      addFilesFormData,
    });
    if (uploadResult instanceof Error) {
      toast.error(`Error uploading ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      return;
    }
    const fileData = uploadResult.data;
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
      console.log('[TableExtractContainer] handleTableExtractTransform', jobParams);
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
  };

  const handleHtmlDownload = () => {
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.download_html', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    downloadFile({
      filename,
      fileContent: selectedFile.tableExtractResult.join('\n\n'),
      fileType: 'text/html',
      suffix: '_extracted_table.html',
    });
  };

  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const handleHtmlXlsxDownload = () => {
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.download_xlsx', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    const htmlData = extractHTMLTables(selectedFile.tableExtractResult.join('\n\n'));

    // Check if we have any tables to process
    if (htmlData.length === 0) {
      toast.error('No tables found to export to Excel');
      return;
    }

    const wb = XLSX.utils.book_new();
    let hasValidTables = false;

    htmlData.forEach((htmlTable, index) => {
      const table = document.createElement('table');
      table.innerHTML = htmlTable;

      // Only process tables that have content
      if (table.rows.length > 0) {
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, `Table ${index + 1}`);
        hasValidTables = true;
      }
    });

    // Only proceed if we have at least one valid table
    if (!hasValidTables) {
      toast.error('No valid tables found to export to Excel');
      return;
    }

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    downloadFile({
      filename,
      fileContent: s2ab(wbout),
      fileType: 'application/octet-stream',
      suffix: `_extracted_table.xlsx`,
    });
  };

  function htmlTableStringToJson(htmlString: string): Record<string, string>[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      throw new Error('No table found in the provided HTML string.');
    }

    const rows = Array.from(table.querySelectorAll('tr'));
    const headers = Array.from(rows[0].children).map((cell) => cell.textContent?.trim() || '');
    const result: Record<string, string>[] = [];

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].children;
      const rowObject: Record<string, string> = {};

      headers.forEach((header, index) => {
        const cellValue = cells[index]?.textContent?.trim() || '';
        rowObject[header] = cellValue;
      });

      result.push(rowObject);
    }

    return result;
  }

  const handleJsonDownload = () => {
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    const jsonResult: Record<string, string>[][] = [];
    const htmlData = extractHTMLTables(selectedFile.tableExtractResult.join('\n\n'));
    htmlData.forEach((htmlTable) => {
      jsonResult.push(htmlTableStringToJson(htmlTable));
    });
    downloadFile({
      filename,
      fileContent: JSON.stringify(jsonResult, null, 2),
      fileType: 'application/json',
      suffix: '_extracted_table.json',
    });
  };

  const extractHTMLTables = (input: string): string[] => {
    const tableRegex = /<table>[\s\S]*?<\/table>/gm;
    const match = input.match(tableRegex);
    return match || [];
  };

  const handleRetry = () => {
    if (isProduction)
      posthog.capture('playground.table.extract_table.retry', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    updateFileAtIndex(selectedFileIndex, 'tableExtractResult', '');
    updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
  };

  const handlePageRetry = async () => {
    if (isProduction)
      posthog.capture('playground.table.extract_table.page_retry', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
      });
    if (selectedFile && selectedFile.file instanceof File) {
      try {
        updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.EXTRACTING);
        const pageBase64 = await extractPageAsBase64(selectedFile.file, resultZoomModal.page);

        const table = await runSyncTableExtract({
          token: token,
          userId: userId,
          apiUrl: apiURL,
          base64String: pageBase64,
          maskPii: extractSettings.removePII,
          fileType: selectedFile.file.type,
        });
        const newResult = selectedFile.tableExtractResult.slice();
        newResult[resultZoomModal.page] = table;
        updateFileAtIndex(selectedFileIndex, 'tableExtractResult', newResult);
      } catch (error) {
        console.error('Error during extraction:', error);
      } finally {
        updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.DONE_EXTRACTING);
        updateQuota({ api_url: apiURL, userId, token, setTotalQuota, setRemainingQuota, handleError });
      }
    } else {
      console.warn('Selected file is not valid or is missing.');
    }
  };

  const getFileType = (): string => {
    let fileType = 'text/html';
    if (selectedFile?.file instanceof File) {
      fileType = selectedFile.file.type;
    }
    return fileType;
  };

  const hasTables = (inputArr: string[]): boolean => {
    return inputArr.filter((pageStr: string) => pageStr !== noPageContent).length > 0;
  };
  const downloadOptions = [
    { value: 'HTML Download', label: 'HTML', callback: handleHtmlDownload },
    { value: 'JSON Download', label: 'JSON', callback: handleJsonDownload },
    { value: 'Excel Download', label: 'Excel', callback: handleHtmlXlsxDownload },
  ];
  const filteredDownloadOptions = downloadOptions.filter((option) => {
    if (!selectedFile?.tableExtractResult) return false;
    if (option.value === 'Excel Download') {
      return hasTables(selectedFile.tableExtractResult);
    }
    if (option.value === 'JSON Download') {
      return hasTables(selectedFile.tableExtractResult);
    }
    return false;
  });
  return (
    <>
      {selectedFile?.instructionExtractState === ExtractState.LIMIT_REACHED ||
      (selectedFile?.instructionExtractState !== ExtractState.DONE_EXTRACTING && remainingQuota === 0) ? (
        <QuotaLimitPage />
      ) : (
        selectedFile && (
          <>
            {selectedFile?.instructionExtractState === ExtractState.READY && (
              <div className="flex flex-col justify-start items-center h-full text-lg text-center gap-4 pt-[calc(20vh-120px)] lg:pt-[calc(30vh-120px)]">
                <div className="flex flex-col items-center justify-center">
                  {filename}
                  <div className="w-[200px] mt-2">
                    <Button
                      label="Extract Table"
                      onClick={() => handleTableExtractTransform()}
                      small
                      labelIcon={Table}
                    />
                  </div>
                </div>
                <ExtractSettingsChecklist removePIIOnly />
              </div>
            )}
            {selectedFile?.instructionExtractState === ExtractState.EXTRACTING && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-xl font-semibold text-neutral-500">Generating HTML Table</div>
                <PulsingIcon Icon={Table} size={40} />
              </div>
            )}
            {selectedFile?.instructionExtractState === ExtractState.DONE_EXTRACTING && (
              <div className="flex flex-col items-start w-full h-full gap-4 p-4 pt-8">
                {hasTables(selectedFile.tableExtractResult) ? (
                  <ResultContainer extractResult={selectedFile.tableExtractResult} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full overflow-auto">
                    <div className="text-xl font-semibold text-neutral-500">
                      No table detected in output. Retry or select another file
                    </div>
                  </div>
                )}
                <div className="w-full h-fit flex gap-4">
                  <Button label="Re-run Document" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
                  {selectedFile.tableExtractResult.length > 1 && (
                    <Button
                      label={`Re-run Page ${resultZoomModal.page + 1}`}
                      onClick={handlePageRetry}
                      small
                      labelIcon={ArrowCounterClockwise}
                    />
                  )}
                  <DropdownButton
                    options={filteredDownloadOptions}
                    optionLabel="Download"
                    icon={DownloadSimple}
                    disabled={
                      selectedFile.instructionExtractState !== ExtractState.DONE_EXTRACTING ||
                      !hasTables(selectedFile.tableExtractResult)
                    }
                  />
                </div>
              </div>
            )}
          </>
        )
      )}
    </>
  );
};

export default TableExtractContainer;
