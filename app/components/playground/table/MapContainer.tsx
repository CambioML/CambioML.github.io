import { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { TableTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import MapTableSelectContainer from './MapTableSelectContainer';
import MapSchemaContainer from './MapSchemaContainer';
import TableExtractContainer from './TableExtractContainer';
import { useProductionContext } from '../ProductionContext';

const MapContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const { isProduction } = useProductionContext();

  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  return (
    <div className={`h-full w-full ${!isProduction && 'grid-row-1 grid-rows-[50px_1fr] gap-4'}`}>
      <div className="h-full">
        {selectedFile?.tableTab === TableTab.TABLE_EXTRACT && <TableExtractContainer />}
        {selectedFile?.tableTab === TableTab.TABLE_SELECT && <MapTableSelectContainer />}
        {selectedFile?.tableTab === TableTab.MAP_SCHEMA && <MapSchemaContainer />}
      </div>
    </div>
  );
};

export default MapContainer;
