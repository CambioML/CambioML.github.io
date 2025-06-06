import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractState, ExtractTab, ExtractedMDTable, TableTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ResultContainer from '../ResultContainer';
import { ArrowLeft, ArrowRight, ArrowsCounterClockwise, Check, CloudArrowUp, Table, X } from '@phosphor-icons/react';
import Button from '../../Button';
import { useProductionContext } from '../ProductionContext';
import { AxiosResponse } from 'axios';
import TableSelectItem from './TableSelectItem';
import PulsingIcon from '../../PulsingIcon';
import { usePostHog } from 'posthog-js/react';
import { useTranslation } from '@/lib/use-translation';
// import { convertExcelToPdf } from '@/app/actions/convertXLSXtoPDF';

const selectButtonStyles =
  'w-full text-center cursor-pointer border-[1px] text-neutral-600 border-neutral-400 rounded-lg flex gap-2 justify-center items-center hover:bg-neutral-100 hover:border-2 hover:font-semibold';

const MapTableSelectContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const { isProduction } = useProductionContext();
  const [tablePreviewIndex, setTablePreviewIndex] = useState(0);
  const posthog = usePostHog();
  const { t } = useTranslation();

  const selectAllTables = (result: ExtractedMDTable[]) => {
    if (result.length > 0) {
      if (isProduction)
        posthog.capture('playground.table.select_table.select_all_tables', {
          route: '/playground',
          module: 'table',
          submodule: 'select_table',
        });
    } else {
      if (isProduction)
        posthog.capture('playground.table.select_table.deselect_all_tables', {
          route: '/playground',
          module: 'table',
          submodule: 'select_table',
        });
    }
    updateFileAtIndex(
      selectedFileIndex,
      'tableMapIndices',
      new Set(result.map((_: ExtractedMDTable, index: number) => index))
    );
  };
  function extractTitleFromTable(tableHtml: HTMLTableElement): string {
    const firstCell = tableHtml.querySelector('tr td')?.textContent?.trim() || 'Table';
    return firstCell;
  }

  function extractHtmlTable(html: string): ExtractedMDTable[] {
    const tables: ExtractedMDTable[] = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tableElements = doc.querySelectorAll('table');

    tableElements.forEach((tableElement) => {
      const title = extractTitleFromTable(tableElement);

      tables.push({
        title,
        table: tableElement.outerHTML,
        tableData: {},
      });
    });

    return tables;
  }

  function mergeTables(firstTableHTML: string, secondTableHTML: string): string {
    const parser = new DOMParser();
    const firstDoc = parser.parseFromString(firstTableHTML, 'text/html');
    const secondDoc = parser.parseFromString(secondTableHTML, 'text/html');

    const firstTable = firstDoc.querySelector('table tbody');
    const secondTableRows = secondDoc.querySelectorAll('table tbody tr');

    secondTableRows.forEach((row, index) => {
      if (index > 0) {
        firstTable?.appendChild(row);
      }
    });

    return firstDoc.body.innerHTML;
  }
  function hasAtLeastNNonEmptyStrings(arr: string[], numStrings: number): boolean {
    const nonEmptyStrings = arr.filter((str) => str.trim() !== '');
    return nonEmptyStrings.length >= numStrings;
  }
  function countEmptyStrings(arr: string[]): number {
    let emptyCount = 0;
    arr.forEach((str) => {
      if (str.trim() === '') emptyCount++;
    });
    return emptyCount;
  }
  function makeUnique(arr: string[]): string[] {
    const countMap: Map<string, number> = new Map();

    return arr.map((item) => {
      if (countMap.has(item)) {
        const count = countMap.get(item)! + 1;
        const newItem = `${item}_${count}`;
        countMap.set(item, count);
        countMap.set(newItem, 0); // Initialize the count for the new item
        return newItem;
      } else {
        countMap.set(item, 0);
        return item;
      }
    });
  }

  const extractTableData = (htmlTable: string, tableTitle: string): { [key: string]: string[] } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTable, 'text/html');
    const rows = doc.querySelectorAll('table tbody tr');
    const tableRows: string[][] = [];
    const tableData: { [key: string]: string[] } = {};
    if (rows === undefined || rows.length < 3) return {};
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const cellArray: string[] = [];
      cells.forEach((cell) => {
        const cellContent = cell.textContent?.trim() || '';
        cellArray.push(cellContent);
      });
      if (hasAtLeastNNonEmptyStrings(cellArray, 2)) tableRows.push(cellArray);
    });
    if (tableRows[0].length === 2) {
      tableRows.forEach((tableRow) => {
        tableData[`${tableTitle}-${tableRow[0]}`] = [tableRow[1]];
      });
    } else {
      let headers: string[] = [];
      tableRows.forEach((tableRow) => {
        if (headers.length === 0) {
          if (countEmptyStrings(tableRow) < 3) {
            headers = makeUnique(tableRow);
            headers.forEach((header) => {
              tableData[`${tableTitle}-${header}`] = [];
            });
          }
        } else {
          tableRow.forEach((cellData, i) => {
            const thisKey = tableTitle + '-' + headers[i];
            tableData[thisKey] && tableData[thisKey].push(cellData);
          });
        }
      });
    }
    return tableData;
  };

  const processResult = (result: string[]) => {
    const initTables: ExtractedMDTable[] = [];
    const htmlTables: ExtractedMDTable[] = [];
    result = result.filter((page) => page.length > 0);
    for (const page of result) {
      const extractedTables = extractHtmlTable(page);
      initTables.push(...extractedTables);
    }
    if (initTables.length > 0) {
      const firstTable = initTables.shift();
      if (firstTable !== undefined) {
        htmlTables.push(firstTable);
      }
    }
    for (const table of initTables) {
      if (table['title'] === htmlTables[htmlTables.length - 1]['title']) {
        htmlTables[htmlTables.length - 1].table = mergeTables(
          htmlTables[htmlTables.length - 1]['table'],
          table['table']
        );
      } else {
        htmlTables.push(table);
      }
    }
    for (const table of htmlTables) {
      table['tableData'] = extractTableData(table['table'], table['title']);
    }

    return htmlTables;
  };

  function mergeTableData(tables: ExtractedMDTable[]): { [key: string]: string[] } {
    const mergedData: { [key: string]: string[] } = {};

    tables.forEach((table) => {
      Object.keys(table.tableData).forEach((key) => {
        if (!mergedData[key]) {
          mergedData[key] = [];
        }
        mergedData[key] = mergedData[key].concat(table.tableData[key]);
      });
    });

    return mergedData;
  }

  const handleSuccess = (response: AxiosResponse | string[]) => {
    let result;
    if (Array.isArray(response)) {
      result = response;
    } else {
      result = response.data;
    }

    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.DONE_EXTRACTING);
    updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.TABLE_EXTRACT);
    const htmlTables = processResult(result);
    const tableMergedData = mergeTableData(htmlTables);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractResult', htmlTables);
    updateFileAtIndex(selectedFileIndex, 'tableMergedData', tableMergedData);
    selectAllTables(htmlTables);
    toast.success(`Generated table(s) from ${filename}!`);
  };

  const handleRetry = () => {
    setTablePreviewIndex(0);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractResult', [{ title: '', table: '', tableData: {} }]);
    updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.TABLE_EXTRACT);
    updateFileAtIndex(selectedFileIndex, 'tableExtractResult', '');
    updateFileAtIndex(selectedFileIndex, 'instructionExtractState', ExtractState.READY);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
    if (isProduction)
      posthog.capture('playground.table.select_table.button_retry_extract', {
        route: '/playground',
        module: 'table',
        submodule: 'select_table',
      });
  };

  const displayTable = () => {
    if (selectedFile) {
      if (selectedFile.tableMdExtractResult.length === 0) {
        return [''];
      }
      if (selectedFile.tableMdExtractResult[tablePreviewIndex]['table'] !== '') {
        return [
          `<h1><strong>${selectedFile.tableMdExtractResult[tablePreviewIndex]['title']}</strong></h1>\n${selectedFile.tableMdExtractResult[tablePreviewIndex]['table']}`,
        ];
      }
    }
    return [''];
  };

  const handleContinueClick = () => {
    if (isProduction)
      posthog.capture('playground.table.select_table.button_continue_to_map', {
        route: '/playground',
        module: 'table',
        submodule: 'select_table',
      });
    updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.MAP_SCHEMA);
  };

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

  const isEmptyTableMdExtractResult = (obj: ExtractedMDTable): boolean => {
    return (
      obj &&
      obj.title === '' &&
      obj.table === '' &&
      Object.keys(obj.tableData).length === 0 &&
      obj.tableData.constructor === Object
    );
  };

  useEffect(() => {
    if (
      selectedFile?.instructionExtractState === ExtractState.DONE_EXTRACTING &&
      selectedFile.tableMdExtractResult.length === 1 &&
      isEmptyTableMdExtractResult(selectedFile.tableMdExtractResult[0])
    ) {
      handleSuccess(selectedFile.tableExtractResult);
    }
  }, [selectedFile]);
  return (
    <>
      {selectedFile?.instructionExtractState === ExtractState.DONE_EXTRACTING ? (
        <div className="h-full grid grid-cols-2 xl:grid-cols-[350px_1fr] grid-rows-[1fr_50px] gap-4">
          <div className="h-full p-4 gap-2 grid grid-rows-[30px_25px_1fr] border-[1px] border-solid rounded-xl">
            {selectedFile?.tableMdExtractState === ExtractState.DONE_EXTRACTING && (
              <>
                <div className="row-span-1 text-lg font-semibold">{t.playground.table.selectTables}</div>
                {selectedFile.tableMdExtractResult.length > 0 ? (
                  <>
                    <div className="row-span-1 h-full w-full flex gap-2">
                      <div
                        onClick={() => selectAllTables(selectedFile.tableMdExtractResult)}
                        className={`${selectButtonStyles} hover:text-green-500`}
                      >
                        {t.playground.table.selectAll}
                        <Check />
                      </div>
                      <div onClick={() => selectAllTables([])} className={`${selectButtonStyles} hover:text-rose-500`}>
                        {t.playground.table.deselectAll}
                        <X />
                      </div>
                    </div>
                    <div className="row-span-1 overflow-auto relative box-border">
                      <div className="w-full h-fit flex flex-col items-start justify-center absolute gap-2">
                        {selectedFile?.tableMdExtractResult.map((table, i) => (
                          <TableSelectItem
                            key={i}
                            tableName={table.title}
                            tableIndex={i}
                            tablePreviewIndex={tablePreviewIndex}
                            setTablePreviewIndex={setTablePreviewIndex}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="row-span-2">
                    {t.playground.table.noTablesFound} <span className="font-semibold">{filename}</span>
                  </div>
                )}
              </>
            )}
            {selectedFile?.tableMdExtractState === ExtractState.UPLOADING && (
              <div className="row-span-4 flex flex-col items-center justify-center h-full">
                <div className="text-xl font-semibold text-neutral-500">Uploading File</div>
              </div>
            )}
            {selectedFile?.tableMdExtractState === ExtractState.EXTRACTING && (
              <div className="row-span-4 flex flex-col items-center justify-center h-full">
                <div className="text-xl font-semibold text-neutral-500">Extracting Tables</div>
              </div>
            )}
          </div>
          <div className="h-full">
            {selectedFile?.tableMdExtractState === ExtractState.READY && (
              <div className="flex flex-col items-center justify-center h-full border-[1px] border-neutral-200 rounded-xl text-neutral-300">
                <Table size={40} />
              </div>
            )}
            {selectedFile?.tableMdExtractState === ExtractState.UPLOADING && (
              <div className="flex flex-col items-center justify-center h-full border-[1px] border-neutral-200 rounded-xl">
                <PulsingIcon Icon={CloudArrowUp} size={40} />
              </div>
            )}
            {selectedFile?.tableMdExtractState === ExtractState.EXTRACTING && (
              <div className="flex flex-col items-center justify-center h-full border-[1px] border-neutral-200 rounded-xl">
                <PulsingIcon Icon={Table} size={40} />
              </div>
            )}
            {selectedFile?.tableMdExtractState === ExtractState.DONE_EXTRACTING && (
              <ResultContainer extractResult={displayTable()} />
            )}
          </div>
          <div className="col-span-2 flex gap-4">
            <Button
              label={t.playground.table.reRunExtract}
              onClick={handleRetry}
              small
              labelIcon={ArrowsCounterClockwise}
            />
            <Button
              label={t.playground.table.mapToSchema}
              onClick={handleContinueClick}
              small
              labelIcon={ArrowRight}
              disabled={
                (selectedFile && selectedFile?.tableMdExtractResult.length === 0) ||
                selectedFile?.tableMdExtractState !== ExtractState.DONE_EXTRACTING
              }
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4">
          <div className="text-xl font-semibold text-neutral-800">{t.playground.table.noTablesExtracted}</div>
          <div className="w-[300px] gap-4">
            <Button
              label={t.playground.table.goToExtractTables}
              onClick={() => updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.TABLE_EXTRACT)}
              small
              labelIcon={ArrowLeft}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MapTableSelectContainer;
