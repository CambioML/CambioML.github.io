'use client';

import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import PlaygroundInfoBar from './PlaygroundInfoBar';
import PreviewModal from '../modals/PreviewModal';
import CompareModal from '../modals/CompareModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';

const PlaygroundContainer = () => {
  const { fileCollapsed } = usePlaygroundStore();
  const playgroundWrapperStyles = `border-solid border-[1px] border-neutral-gray }`;
  //Dummy comment to test the build

  return (
    <>
      <PreviewModal />
      <CompareModal />
      <PlaygroundInfoBar />
      <div className="w-full min-w-[600px] max-w-[2520px] flex flex-col gap-0 h-fit lg:h-fit">
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
            ${fileCollapsed ? 'lg:grid-cols-[100px_1fr]' : 'lg:grid-cols-[325px_1fr]'}
          `}
        >
          <div className={`${playgroundWrapperStyles}  bg-neutral-100 ${fileCollapsed ? 'p-2' : 'p-6 pl-10'} pr-0 `}>
            <FilesContainer />
          </div>
          <div className={`${playgroundWrapperStyles} border-l-[1px] border-b-[1px] p-6 pr-10`}>
            <ActionContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundContainer;
