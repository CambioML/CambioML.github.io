'use client';

import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import PlaygroundInfoBar from './PlaygroundInfoBar';
import PreviewModal from '../modals/PreviewModal';
import CompareModal from '../modals/CompareModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { cn } from '@/lib/cn';

const PlaygroundContainer = () => {
  const { fileCollapsed } = usePlaygroundStore();

  return (
    <>
      <PreviewModal />
      <CompareModal />
      <PlaygroundInfoBar />
      <div className="relative w-full min-w-[600px] max-w-[2520px] flex flex-col gap-0 h-fit">
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

        <div
          className={`
            w-full
            lg:h-[80vh]
            grid
            grid-rows-[550px_1fr]
            lg:grid-rows-1
            grid-cols-1
            transition-all
            duration-300
            gap-0
            ${fileCollapsed ? 'lg:grid-cols-[100px_1fr]' : 'lg:grid-cols-[325px_1fr]'}
          `}
        >
          <div
            className={cn(
              'pb-4 ml-4 border rounded-lg transition-all duration-300 ease-in-out pr-0',
              fileCollapsed ? 'p-2 rounded-l-xl' : 'px-2 pl-4 rounded-l-xl',
              'bg-white/[0.08] dark:bg-neutral-800/[0.08] border-border dark:border-neutral-700 hover:bg-white/[0.12] dark:hover:bg-neutral-800/[0.12]'
            )}
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <FilesContainer />
          </div>
          <div
            className={cn(
              'border-l-0 border-y-2 border-r-2 transition-all duration-300 ease-in-out px-6 pr-10 rounded-r-xl',
              'bg-white/[0.08] dark:bg-neutral-800/[0.08] border-white/20 dark:border-neutral-700/20 hover:bg-white/[0.12] dark:hover:bg-neutral-800/[0.12]'
            )}
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <ActionContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundContainer;
