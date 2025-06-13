import UploadButton from './UploadButton';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { CaretLeft, FileDashed } from '@phosphor-icons/react';
import FileItem from './FileItem';
import LogoutButton from '../auth/LogoutButton';
import QuotaDisplay from './QuotaDisplay';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/cn';

const FilesContainer = () => {
  const { t } = useTranslation();
  const { files, loggedIn, userId, fileCollapsed, setFileCollapsed } = usePlaygroundStore();

  return (
    <div className={cn(`h-[500px] lg:h-full w-full min-h-[200px] grid lg:grid-cols-[1fr_20px]`)}>
      <div className="cols-span-1 grid grid-rows-[50px_1fr_70px_70px_70px] p-2">
        <h2 className="row-span-1 text-2xl font-semibold pt-4">{!fileCollapsed && t.playground.files.title}</h2>
        <div className="row-span-1 overflow-auto relative">
          {files.length > 0 ? (
            <div className="w-full h-fit flex flex-col items-start justify-center absolute gap-2">
              {files.map((file, i) => (
                <FileItem key={i} pgFile={file} index={i} />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileDashed size={40} className="text-neutral-500" />
            </div>
          )}
        </div>

        <div className="row-span-1 h-full flex items-center justify-center py-2">
          {files.length > 0 && <UploadButton small collapsed={fileCollapsed} />}
        </div>
        {loggedIn && (
          <>
            <div className="row-span-1 h-full border-y-2 py-2 w-full flex flex-col gap-2 items-center justify-center">
              <LogoutButton collapsed={fileCollapsed} />
            </div>
            <QuotaDisplay userId={userId} isCollapsed={fileCollapsed} />
          </>
        )}
      </div>
      <button
        className={cn(
          'hidden border lg:flex items-center justify-center cursor-pointer rounded-l-xl',
          'hover:bg-neutral-300 dark:hover:bg-neutral-700 border-r-0 dark:border-r-0'
        )}
        onClick={() => {
          setFileCollapsed(!fileCollapsed);
        }}
      >
        {fileCollapsed ? <CaretRight size={40} /> : <CaretLeft size={40} />}
      </button>
    </div>
  );
};

export default FilesContainer;
