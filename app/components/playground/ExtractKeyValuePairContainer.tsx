import { useEffect, useState } from 'react';
import MarkdownExtractContainer from './MarkdownExtractContainer';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import Button from '../Button';

const ExtractKeyValuePairContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  return (
    <div className="h-full w-full pt-4 relative">
      {/* {selectedFile?.file instanceof File && <MarkdownExtractContainer />} */}
      <div className="h-[calc(100%-16px)] w-60 p-4 rounded-2xl shadow-[0px_0px_4px_2px_rgba(0,_0,_0,_0.1)] absolute top-4 right-0">
        <div className="w-full h-12 flex">
          <Button
            label="Extract Key-Value"
            onClick={() => {
              console.log('extract key-value pairs');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExtractKeyValuePairContainer;
