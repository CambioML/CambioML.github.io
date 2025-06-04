import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import LoginComponent from '../auth/Login';
import PlaygroundTab from './PlaygroundTab';
import { useEffect, useState } from 'react';
import { PlaygroundFile, PlaygroundTabs, getPlaygroundTabLabel } from '@/app/types/PlaygroundTypes';
import UploadButton from './UploadButton';
import MapContainer from './table/MapContainer';
import ExtractContainer from './ExtractContainer';
import ExtractKeyValuePairContainer from './ExtractKeyValuePairContainer';
import { useTranslation } from '@/lib/use-translation';

const ActionContainer = () => {
  const { loggedIn, selectedFileIndex, files } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  return (
    <div className="w-full h-full grid grid-rows-[50px_1fr] border border-border rounded-lg">
      <div className={`w-full grid grid-cols-3`}>
        {Object.values(PlaygroundTabs).map((tabKey) => (
          <PlaygroundTab key={tabKey} tabKey={tabKey} label={getPlaygroundTabLabel(tabKey, t)} />
        ))}
      </div>
      {loggedIn ? (
        selectedFileIndex === null ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-xl font-semibold text-neutral-500">{t.playground.files.pleaseUploadFile}</div>
            <div className="w-[300px]">
              <UploadButton small />
            </div>
          </div>
        ) : (
          <div className="h-full border-solid border-2 border-t-0 border-neutral-200 rounded-b-xl p-4 pt-0 box-border">
            {(selectedFile?.activeTab === PlaygroundTabs.PLAIN_TEXT || selectedFileIndex === null) && (
              <ExtractContainer />
            )}
            {selectedFile?.activeTab === PlaygroundTabs.TABLE && <MapContainer />}
            {selectedFile?.activeTab === PlaygroundTabs.KEY_VALUE_PAIR && <ExtractKeyValuePairContainer />}
          </div>
        )
      ) : (
        <LoginComponent />
      )}
    </div>
  );
};

export default ActionContainer;
