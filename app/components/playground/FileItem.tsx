import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import usePreviewModal from '@/app/hooks/usePreviewModal';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { FileMagnifyingGlass } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

interface FileItemProps {
  pgFile: PlaygroundFile;
  index: number;
}

const FileItem = ({ pgFile, index }: FileItemProps) => {
  const { selectedFileIndex, setSelectedFileIndex } = usePlaygroundStore();
  const [filename, setFilename] = useState<string>('');
  const previewModal = usePreviewModal();

  useEffect(() => {
    if (pgFile.file instanceof File) {
      setFilename(pgFile.file.name);
    } else {
      setFilename(pgFile.file);
    }
  }, [pgFile.file, setFilename]);

  const handleClick = () => {
    setSelectedFileIndex(index);
  };

  const handlePreviewClick = () => {
    previewModal.setFile(pgFile.file as File);
    previewModal.onOpen();
  };
  return (
    <div
      className={`
                    w-full
                    h-[50px]
                    flex
                    justify-between
                    items-center
                    cursor-pointer
                    px-4
                    rounded-md
                    ${index === selectedFileIndex ? 'bg-cambio-primary' : 'hover:bg-neutral-200'}
                    relative
                    group
                    `}
      onClick={handleClick}
    >
      <h3 className="truncate file-item-name">{filename}</h3>
      <div
        className="flex items-center text-neutral-500 justify-center bg-white rounded-md w-[35px] h-[35px] hover:bg-neutral-100 hover:text-neutral-800 hover:border shrink-0"
        onClick={handlePreviewClick}
      >
        <FileMagnifyingGlass size={20} />
      </div>
    </div>
  );
};

export default FileItem;
