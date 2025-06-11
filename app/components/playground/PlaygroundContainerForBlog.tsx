'use client';

import UploadModal from '../modals/UploadModal';
import PreviewModal from '../modals/PreviewModal';
import CompareModal from '../modals/CompareModal';
import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import { useTranslation } from '@/lib/use-translation';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { cn } from '@/lib/cn';

const PlaygroundContainerForBlog = () => {
  const { t } = useTranslation();
  const { fileCollapsed } = usePlaygroundStore();

  return (
    <>
      <UploadModal />
      <PreviewModal />
      <CompareModal />
      <div
        className={cn(
          'relative w-full min-w-[800px] gap-0 h-fit grid grid-cols-[20%_1fr] -translate-x-[15%] border p-2 rounded-lg',
          fileCollapsed && 'grid-cols-[auto_1fr]'
        )}
      >
        <FilesContainer />
        {/* Clean subtle gradient backgrounds */}
        <div
          className="absolute inset-0 rounded-xl blur-3xl opacity-15 pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(236, 72, 153, 0.08) 100%)',
          }}
        />

        {/* accent gradients */}
        <div
          className="absolute top-1/3 left-[10%] w-[80%] h-1/2 rounded-full blur-3xl opacity-11 pointer-events-none z-0"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        />

        <div className="p-4 mb-10 h-[700px]">
          <h2 className="text-3xl font-bold mb-6 pl-1 bg-gradient">{t.playground.tryForFree}</h2>
          <ActionContainer />
        </div>
      </div>
    </>
  );
};

export default PlaygroundContainerForBlog;
