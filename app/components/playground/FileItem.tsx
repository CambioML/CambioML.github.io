import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import usePreviewModal from '@/app/hooks/usePreviewModal';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { FileMagnifyingGlass } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

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
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors w-full cursor-pointer',
        index === selectedFileIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50 text-muted-foreground'
      )}
      onClick={handleClick}
    >
      <span className="truncate flex-1">{filename}</span>
      <button
        type="button"
        className="flex items-center justify-center rounded-md w-8 h-8 shrink-0 bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handlePreviewClick();
        }}
      >
        <FileMagnifyingGlass size={18} />
      </button>
    </div>
  );
};

export default FileItem;
