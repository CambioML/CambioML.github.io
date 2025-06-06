'use client';

import UploadModal from '../modals/UploadModal';
import PreviewModal from '../modals/PreviewModal';
import CompareModal from '../modals/CompareModal';
import ActionContainer from './ActionContainer';
import { useTranslation } from '@/lib/use-translation';

const PlaygroundContainerForBlog = () => {
  const { t } = useTranslation();

  return (
    <>
      <UploadModal />
      <PreviewModal />
      <CompareModal />
      <div className="relative w-full min-w-[800px] max-w-[2520px] flex flex-col gap-0 h-fit">
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

        <div className="my-4 mb-10 h-[500px]">
          <h2 className="text-3xl font-bold mb-6 pl-1 bg-gradient">{t.playground.interactivePlayground}</h2>
          <ActionContainer />
        </div>
      </div>
    </>
  );
};

export default PlaygroundContainerForBlog;
