import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractTab, PlaygroundFile, ExtractState } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import Button from '../../Button';
import { ArrowCounterClockwise, DownloadSimple, Table } from '@phosphor-icons/react';
import PulsingIcon from '../../PulsingIcon';
import toast from 'react-hot-toast';
import { downloadFile } from '@/app/actions/downloadFile';
import { AxiosError, AxiosResponse } from 'axios';
import ResultContainer from '../ResultContainer';
import { useProductionContext } from '../ProductionContext';
import { runRequestJob as runPreProdRequestJob } from '@/app/actions/preprod/runRequestJob';
import { runRequestJob } from '@/app/actions/runRequestJob';
import * as XLSX from 'xlsx';
import { usePostHog } from 'posthog-js/react';
import ExtractSettingsChecklist from '../ExtractSettingsChecklist';
import { JobParams } from '@/app/actions/preprod/apiInterface';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import DropdownButton from '../../inputs/DropdownButton';
import QuotaLimitPage from '../QuotaLimitPage';

const TableExtractContainer = () => {
  const { apiURL, isProduction } = useProductionContext();
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
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const handleSuccess = (response: AxiosResponse, targetPageNumbers?: number[]) => {
    let result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
      return;
    }
    result = result.filter((page: string) => page.length > 0);
    if (isProduction)
      posthog.capture('playground.table.extract_table.success', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
        num_pages: result.length,
      });

    if (!isProduction) console.log('[MarkdownExtract] result:', result);
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
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Missing formData. Please try again.`);
      return;
    }

    if (selectedFileIndex === null || !selectedFile || !fileData) {
      toast.error(`Error extracting ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
      return;
    }
    const jobParams: JobParams = {
      targetPageNumbers,
      maskPiiFlag: extractSettings.removePII,
    };
    if (isProduction) {
      runRequestJob({
        apiURL: apiURL,
        clientId,
        token,
        sourceType: 's3',
        fileId: fileData.fileId,
        jobType: 'info_extraction',
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
      runPreProdRequestJob({
        apiURL: apiURL,
        clientId,
        token,
        sourceType: 's3',
        fileId: fileData.fileId,
        jobType: 'info_extraction',
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
    const wb = XLSX.utils.book_new();
    htmlData.forEach((htmlTable, index) => {
      const table = document.createElement('table');
      table.innerHTML = htmlTable;

      const ws = XLSX.utils.table_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, `Table ${index + 1}`);
    });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    downloadFile({
      filename,
      fileContent: s2ab(wbout),
      fileType: 'application/octet-stream',
      suffix: `_extracted_table.xlsx`,
    });
  };

  function htmlTableStringToJson(htmlString: string): Record<string, string[]> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      throw new Error('No table found in the provided HTML string.');
    }
    const rows = Array.from(table.querySelectorAll('tr'));
    const numCols = rows[0].children.length;
    const result: Record<string, string[]> = {};

    if (numCols === 2) {
      rows.forEach((row) => {
        const cells = row.children;
        const header = cells[0].textContent?.trim() || '';
        const value = cells[1].textContent?.trim() || '';
        if (header && value) {
          result[header] = [value];
        }
      });
    } else {
      const headers = Array.from(rows[0].children).map((cell) => cell.textContent?.trim() || '');
      headers.forEach((header) => {
        result[header] = [];
      });

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].children;
        headers.forEach((header, index) => {
          const cellValue = cells[index].textContent?.trim() || '';
          if (cellValue) {
            result[header].push(cellValue);
          }
        });
      }
    }

    return result;
  }

  const handleJsonDownload = () => {
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    const jsonResult: Record<string, string[]>[] = [];
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

  const handlePageRetry = () => {
    if (isProduction)
      posthog.capture('playground.table.extract_table.page_retry', {
        route: '/playground',
        module: 'plain_text',
        file_type: getFileType(),
      });
    handleTableExtractTransform([resultZoomModal.page]);
  };

  const getFileType = (): string => {
    let fileType = 'text/html';
    if (selectedFile?.file instanceof File) {
      fileType = selectedFile.file.type;
    }
    return fileType;
  };

  const downloadOptions = [
    { value: 'HTML Download', label: 'HTML', callback: handleHtmlDownload },
    { value: 'JSON Download', label: 'JSON', callback: handleJsonDownload },
    { value: 'Excel Download', label: 'Excel', callback: handleHtmlXlsxDownload },
  ];
  const filteredDownloadOptions = downloadOptions.filter((option) => {
    if (!selectedFile?.tableExtractResult) return false;
    if (option.value === 'Excel Download') {
      return extractHTMLTables(selectedFile.tableExtractResult.join('')).length > 0;
    }
    if (option.value === 'JSON Download') {
      return !isProduction && extractHTMLTables(selectedFile.tableExtractResult.join('')).length > 0;
    }
    if (
      option.value === 'HTML Download' &&
      selectedFile.tableExtractResult.length > 0 &&
      selectedFile.tableExtractResult[0].length > 0
    ) {
      return true;
    }
    return false;
  });

  return (
    <>
      {selectedFile && (
        <>
          {selectedFile?.instructionExtractState === ExtractState.READY && (
            <div className="flex flex-col justify-end items-center h-full text-lg text-center gap-4">
              <div className="flex flex-col items-center justify-center">
                {filename}
                <div className="w-[200px] mt-2">
                  <Button label="Extract Table" onClick={() => handleTableExtractTransform()} small labelIcon={Table} />
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
            <div className="flex flex-col items-start w-full h-full gap-4">
              {selectedFile.tableExtractResult.length > 0 ? (
                <ResultContainer extractResult={selectedFile.tableExtractResult} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full overflow-auto">
                  <div className="text-xl font-semibold text-neutral-500">
                    No table detected in output. Retry or select another file
                  </div>
                </div>
              )}
              <div className={`w-full h-fit flex gap-4`}>
                <Button label="Re-run Document" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
                {!isProduction && selectedFile.tableExtractResult.length > 1 && (
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
                  disabled={selectedFile.instructionExtractState !== ExtractState.DONE_EXTRACTING}
                />
              </div>
            </div>
          )}
          {selectedFile?.instructionExtractState === ExtractState.LIMIT_REACHED && <QuotaLimitPage />}
        </>
      )}
    </>
  );
};

export default TableExtractContainer;
