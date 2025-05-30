import UploadButton from './UploadButton';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { CaretLeft, FileDashed } from '@phosphor-icons/react';
import FileItem from './FileItem';
import LogoutButton from '../auth/LogoutButton';
import QuotaDisplay from './QuotaDisplay';
import { useProductionContext } from './ProductionContext';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';

const FilesContainer = () => {
  const { files, loggedIn, userId, fileCollapsed, setFileCollapsed } = usePlaygroundStore();
  const { isProduction } = useProductionContext();

  const logoutUrl = isProduction
    ? process.env.NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND
    : process.env.NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND_PRE_PROD;

  return (
    <div className={`h-[500px] lg:h-full w-full min-h-[200px] grid lg:grid-cols-[1fr_20px]`}>
      <div className="cols-span-1 grid grid-rows-[50px_1fr_70px_70px_70px] pr-4">
        <h2 className="row-span-1 text-2xl font-semibold pt-4">{!fileCollapsed && 'Files'}</h2>
        <div className="row-span-1 overflow-auto relative box-border">
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
          {files.length > 0 && <UploadButton small disabled={!loggedIn} collapsed={fileCollapsed} />}
        </div>
        {loggedIn && (
          <>
            <div className="row-span-1 h-full border-y-2 py-2 w-full flex flex-col gap-2 items-center justify-center">
              <LogoutButton logoutUrl={logoutUrl || 'https://www.cambioml.com/playground'} collapsed={fileCollapsed} />
            </div>
            <QuotaDisplay userId={userId} isCollapsed={fileCollapsed} />
          </>
        )}
      </div>
      <div
        className="hidden border-[1px] border-r-0 lg:flex items-center justify-center cursor-pointer hover:bg-neutral-300 rounded-l-xl"
        onClick={() => {
          setFileCollapsed(!fileCollapsed);
        }}
      >
        {fileCollapsed ? (
          <button>
            <CaretRight size={20} />
          </button>
        ) : (
          <button>
            <CaretLeft size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilesContainer;
