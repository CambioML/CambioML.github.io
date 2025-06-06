import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractState, TableTab, PlaygroundFile, JobType } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import { ArrowLeft, DownloadSimple, Plus, Robot } from '@phosphor-icons/react';
import Button from '../../Button';
// import MapSchemaCol from './MapSchemaCol';
import InputBasic from '../../inputs/InputBasic';
import toast from 'react-hot-toast';
import KeySelectModal from '../../modals/KeySelectModal';
import { runMappingRequest } from '@/app/actions/runMappingRequest';
import { downloadFile } from '@/app/actions/downloadFile';
import MapSchemaTable from './MapSchemaTable';
import { useProductionContext } from '../ProductionContext';
import { usePostHog } from 'posthog-js/react';
import { runRequestJob } from '@/app/actions/runRequestJob';
import { AxiosError, AxiosResponse } from 'axios';

const MIN_INPUT_LENGTH = 1;

const MapSchemaContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex, clientId, token, filesFormData } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { apiURL, isProduction } = useProductionContext();
  const posthog = usePostHog();

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

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
    toast.error(`Map Schema request for ${filename} timed out. Please try again.`);
  };

  const handleError = (e: AxiosError) => {
    console.error('handling schema error', e);
    if (e.response) {
      toast.error(`${filename}: Schema Extraction error. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.error', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type:
          selectedFile?.file instanceof File
            ? selectedFile.file.type
            : typeof selectedFile?.file === 'string'
              ? 'html'
              : undefined,
        error_status: e.response?.status,
        error_message: e.response?.data,
      });
    toast.error(`${filename}: Schema Extraction error. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
  };

  const handleSuccess = (response: AxiosResponse) => {
    const result = response.data;
    if (result === undefined || result['result'] === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      return;
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.success', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type:
          selectedFile?.file instanceof File
            ? selectedFile.file.type
            : typeof selectedFile?.file === 'string'
              ? 'html'
              : undefined,
        num_pages: result.length,
      });

    if (!isProduction) console.log('[SchemaMap] result:', result, response);
    setIsLoading(false);
    if (!selectedFile) return;
    const currentMap = selectedFile.keyMap;
    for (const key in result['result']) {
      if (Object.hasOwn(currentMap, key)) {
        currentMap[key] = result['result'][key];
      }
    }
    updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
    if (isProduction) {
      const n_mapped_keys = Object.keys(currentMap).filter((key) => currentMap[key] !== '').length;
      const n_null_keys = Object.keys(currentMap).length - n_mapped_keys;
      posthog.capture('playground.table.map_schema.success', {
        route: '/playground',
        module: 'table',
        submodule: 'map_schema',
        num_mapped_keys: n_mapped_keys,
        num_null_keys: n_null_keys,
      });
    }
    const inputKeys = Object.keys(currentMap);
    const tableKeysData = selectedFile.tableMergedData;
    const tableColumns = [];
    const tableMappedDataRows: string[][] = [inputKeys];
    let maxColLength = -1;
    for (const inputKey of inputKeys) {
      const mappedKey = currentMap[inputKey];
      const mappedValues = tableKeysData[mappedKey] || ['None'];
      maxColLength = Math.max(mappedValues.length, maxColLength);
      tableColumns.push(mappedValues);
    }

    for (let i = 0; i < maxColLength; i++) {
      const thisRow: string[] = [];
      tableColumns.forEach((col) => {
        if (col.length === 1) {
          thisRow.push(col[0]);
        } else {
          thisRow.push(col[i] || '');
        }
      });
      tableMappedDataRows.push(thisRow);
    }

    updateFileAtIndex(selectedFileIndex, 'tableMappedDataRows', tableMappedDataRows);

    toast.success(`Generated Schema Map for ${filename}`);
  };

  const handleMapSchemaPreprod = async () => {
    setIsLoading(true);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Missing formData. Please try again.`);
      return;
    }
    if (selectedFile) {
      const allTables = selectedFile.tableMdExtractResult;
      const tablesToMap = allTables.filter((table, i) => selectedFile.tableMapIndices.has(i));

      const currentMap = selectedFile.keyMap;

      const tableKeys: string[] = [];
      for (const table of tablesToMap) {
        tableKeys.push(...Object.keys(table['tableData']));
      }
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
      const currentKeys = Object.keys(currentMap).filter((key) => currentMap[key] === '' || currentMap[key] === null);
      console.log('fileData', fileData);
      const jobParams = {
        schemaInfo: {
          tableSchema: tableKeys,
          dbSchema: currentKeys,
        },
      };
      if (selectedFile && selectedFileIndex !== null) {
        console.log('Preprod mapping', jobParams);
        runRequestJob({
          apiURL: apiURL,
          clientId,
          token,
          sourceType: 's3',
          fileId: fileData.fileId,
          jobType: JobType.SCHEMA_EXTRACTION_FRONTEND,
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

  const handleMapSchema = async () => {
    if (!isProduction) {
      handleMapSchemaPreprod();
    } else {
      handleMapSchemaProd();
    }
  };

  const handleMapSchemaProd = async () => {
    if (isProduction)
      posthog.capture('playground.table.map_schema.button_map_schema', {
        route: '/playground',
        module: 'table',
        submodule: 'map_schema',
        num_keys: Object.keys(selectedFile?.keyMap || {}).length,
      });
    setIsLoading(true);
    if (selectedFile) {
      const allTables = selectedFile.tableMdExtractResult;
      const tablesToMap = allTables.filter((table, i) => selectedFile.tableMapIndices.has(i));

      const currentMap = selectedFile.keyMap;

      const tableKeys: string[] = [];
      for (const table of tablesToMap) {
        tableKeys.push(...Object.keys(table['tableData']));
      }
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
      const currentKeys = Object.keys(currentMap).filter((key) => currentMap[key] === '' || currentMap[key] === null);

      if (currentKeys.length > 0) {
        try {
          const result = await runMappingRequest({ tableSchema: tableKeys, keysToMap: currentKeys });
          setIsLoading(false);
          for (const key in result) {
            if (Object.hasOwn(currentMap, key)) {
              currentMap[key] = result[key];
            }
          }
          updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
          if (isProduction) {
            const n_mapped_keys = Object.keys(currentMap).filter((key) => currentMap[key] !== '').length;
            const n_null_keys = Object.keys(currentMap).length - n_mapped_keys;
            posthog.capture('playground.table.map_schema.success', {
              route: '/playground',
              module: 'table',
              submodule: 'map_schema',
              num_mapped_keys: n_mapped_keys,
              num_null_keys: n_null_keys,
            });
          }
          const inputKeys = Object.keys(currentMap);
          const tableKeysData = selectedFile.tableMergedData;
          const tableColumns = [];
          const tableMappedDataRows: string[][] = [inputKeys];
          let maxColLength = -1;
          for (const inputKey of inputKeys) {
            const mappedKey = currentMap[inputKey];
            const mappedValues = tableKeysData[mappedKey] || ['None'];
            maxColLength = Math.max(mappedValues.length, maxColLength);
            tableColumns.push(mappedValues);
          }

          for (let i = 0; i < maxColLength; i++) {
            const thisRow: string[] = [];
            tableColumns.forEach((col) => {
              if (col.length === 1) {
                thisRow.push(col[0]);
              } else {
                thisRow.push(col[i] || '');
              }
            });
            tableMappedDataRows.push(thisRow);
          }

          updateFileAtIndex(selectedFileIndex, 'tableMappedDataRows', tableMappedDataRows);

          toast.success(`Generated Schema Map for ${filename}`);
        } catch (error) {
          toast.error(`Error mapping schema for ${filename}. Please try again.`);
          if (isProduction)
            posthog.capture('playground.table.map_schema.error', {
              route: '/playground',
              module: 'table',
              submodule: 'map_schema',
            });
        }
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleQueryChange = (newQuery: string) => {
    if (newQuery.length < MIN_INPUT_LENGTH) {
      setInputError(`Input must be at least ${MIN_INPUT_LENGTH} characters`);
    } else {
      setInputError('');
    }
    setQuery(newQuery);
  };

  const handleAddKey = () => {
    if (isProduction)
      posthog.capture('playground.table.map_schema.add_key', {
        route: '/playground',
        module: 'table',
        submodule: 'map_schema',
      });
    if (selectedFile) {
      const currentMap = { ...selectedFile.keyMap };
      let newKeys: string[] = [];

      if (query.includes(',')) {
        newKeys = query
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else {
        newKeys = [query];
      }
      newKeys = newKeys.filter((key) => !currentMap[key]);
      for (const key of newKeys) {
        currentMap[key] = '';
      }
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
      setQuery('');
    }
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

  const handleTableSelectClick = () => {
    updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.TABLE_SELECT);
  };

  const handleTableExtractClick = () => {
    updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.TABLE_EXTRACT);
  };

  const handleDownloadTable = () => {
    if (isProduction)
      posthog.capture('playground.table.map_schema.download_csv', {
        route: '/playground',
        module: 'table',
        submodule: 'map_schema',
      });
    if (!selectedFile?.keyMap) {
      return;
    }
    const tableData = selectedFile.tableMappedDataRows;
    const header = ['id', ...tableData[0]];
    const dataWithID = tableData.slice(1).map((row, index) => [index, ...row]);
    const dataWithHeaderID = [header, ...dataWithID];
    const csvData = dataWithHeaderID
      .map((row) =>
        row
          .map(String)
          .map((value) => `"${value}"`)
          .join(',')
      )
      .join('\n');
    downloadFile({
      filename,
      fileContent: csvData,
      fileType: 'text/csv',
      suffix: `_extracted_table.csv`,
    });
  };

  const handleDownloadJson = () => {
    if (isProduction)
      posthog.capture('playground.table.map_schema.download_json', {
        route: '/playground',
        module: 'table',
        submodule: 'map_schema',
      });
    if (!selectedFile) return;
    const outputJson = [];
    for (let i = 1; i < selectedFile.tableMappedDataRows.length; i++) {
      const row = selectedFile.tableMappedDataRows[i];
      const obj: { [key: string]: string } = {};
      for (let j = 0; j < row.length; j++) {
        obj[selectedFile.tableMappedDataRows[0][j]] = row[j];
      }
      outputJson.push(obj);
    }
    downloadFile({
      filename,
      fileContent: JSON.stringify(outputJson, null, 2),
      fileType: 'application/json',
      suffix: `_extracted_table.json`,
    });
  };

  const hasNonNullValue = (keyMap: { [key: string]: string | null }) => {
    for (const key in keyMap) {
      if (keyMap[key] !== '' && keyMap[key] !== null) return true;
    }
  };

  return (
    <>
      {selectedFile?.instructionExtractState !== ExtractState.DONE_EXTRACTING ? (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4">
          <div className="text-xl font-semibold text-neutral-800">No Tables Extracted</div>
          <div className="w-[300px] gap-4">
            <Button label="Go to Table Extract" onClick={handleTableExtractClick} small labelIcon={ArrowLeft} />
          </div>
        </div>
      ) : (
        <>
          {selectedFile?.tableMdExtractState !== ExtractState.DONE_EXTRACTING ||
          selectedFile?.tableMdExtractResult.length === 0 ||
          selectedFile?.tableMdExtractResult[0]['table'] === '' ||
          selectedFile?.tableMapIndices.size === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4">
              <div className="text-xl font-semibold text-neutral-800">No Tables Selected</div>
              <div className="w-[300px] gap-4">
                <Button label="Go to Table Select" onClick={handleTableSelectClick} small labelIcon={ArrowLeft} />
              </div>
            </div>
          ) : (
            <div className="h-full grid grid-cols-1 grid-rows-[1fr_70px_50px] gap-4">
              <div className="row-span-1 overflow-auto relative box-border">
                <div className="w-full h-fit justify-center absolute">
                  {selectedFile.keyMap && (
                    <MapSchemaTable
                      keyMap={selectedFile?.keyMap}
                      tableMappedDataRows={selectedFile.tableMappedDataRows}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </div>
              <div
                className={`row-span-1 border-b-[1px] border-neutral-200 flex items-center justify-center gap-2 h-fit pb-2`}
              >
                <div className={`w-full h-fit gap-4 grid grid-cols-[1fr_150px]`}>
                  <InputBasic
                    label="Schema Keys"
                    value={query}
                    onChange={handleQueryChange}
                    error={inputError}
                    labelDescription="Enter a single key or multiple keys as comma-separated list"
                    highlight={Object.keys(selectedFile?.keyMap || {}).length === 0 && !query}
                    onEnter={handleAddKey}
                  />
                  <Button
                    label="Add Keys"
                    onClick={handleAddKey}
                    small
                    labelIcon={Plus}
                    disabled={(query.length < MIN_INPUT_LENGTH && inputError !== '') || isLoading}
                  />
                </div>
              </div>
              <div className="row-span-1 flex gap-4">
                <Button
                  label="Map Schema"
                  onClick={handleMapSchema}
                  small
                  labelIcon={Robot}
                  disabled={(selectedFile && Object.keys(selectedFile?.keyMap).length === 0) || isLoading}
                />
                <Button
                  label="Download CSV"
                  onClick={handleDownloadTable}
                  small
                  labelIcon={DownloadSimple}
                  disabled={!hasNonNullValue(selectedFile.keyMap) || isLoading}
                />
                <Button
                  label="Download Json"
                  onClick={handleDownloadJson}
                  small
                  labelIcon={DownloadSimple}
                  disabled={!hasNonNullValue(selectedFile.keyMap) || isLoading}
                />
              </div>
              <KeySelectModal />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MapSchemaContainer;
