import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import usePreviewModal from '@/app/hooks/usePreviewModal';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { FileMagnifyingGlass } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import useTheme from '@/app/hooks/useTheme';
import { cn } from '@/lib/cn';

interface FileItemProps {
  pgFile: PlaygroundFile;
  index: number;
}

const FileItem = ({ pgFile, index }: FileItemProps) => {
  const { selectedFileIndex, setSelectedFileIndex } = usePlaygroundStore();
  const [filename, setFilename] = useState<string>('');
  const previewModal = usePreviewModal();
  const theme = useTheme();
  const isDark = theme === 'dark';

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
      className={cn(
        'w-full h-[50px] flex justify-between items-center cursor-pointer px-4 rounded-md relative group',
        index === selectedFileIndex
          ? isDark
            ? 'bg-neutral-700'
            : 'bg-cambio-primary'
          : isDark
            ? 'hover:bg-neutral-700'
            : 'hover:bg-neutral-200'
      )}
      onClick={handleClick}
    >
      <h3 className="truncate file-item-name">{filename}</h3>
      <div
        className={cn(
          'flex items-center justify-center rounded-md w-[35px] h-[35px] shrink-0 cursor-pointer',
          isDark
            ? 'bg-neutral-600 text-neutral-300 hover:bg-neutral-500 hover:text-neutral-100'
            : 'bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 hover:border'
        )}
        onClick={handlePreviewClick}
      >
        <FileMagnifyingGlass size={20} />
      </div>
    </div>
  );
};

export default FileItem;
