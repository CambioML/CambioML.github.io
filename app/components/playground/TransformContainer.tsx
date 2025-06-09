import { useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractState } from '@/app/types/PlaygroundTypes';
import ComingSoonBanner from './ComingSoonBanner';
import { useProductionContext } from './ProductionContext';

enum TransformMethod {
  QA,
  SUMMARIZE,
}

const selectedTabStyle = 'text-neutral-800 border-b-4 border-neutral-800 font-semibold';
const unselectedTabStyle = 'text-neutral-500 border-neutral-200';
const tabStyle = 'p-2 text-center cursor-pointer border-solid border-b hover:border-b-4 hover:font-semibold';

const TransformContainer = () => {
  const { isProduction } = useProductionContext();
  const { files, selectedFileIndex } = usePlaygroundStore();
  const [transformMethod, setTransformMethod] = useState<TransformMethod>(TransformMethod.QA);

  return (
    <div className="h-full w-full grid grid-rows-[50px_1fr] gap-4">
      <div className="w-full grid grid-cols-2 pt-2">
        <div
          className={`${transformMethod === TransformMethod.QA ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => setTransformMethod(TransformMethod.QA)}
        >
          Generate QA Pairs
        </div>
        <div
          className={`${transformMethod === TransformMethod.SUMMARIZE ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => setTransformMethod(TransformMethod.SUMMARIZE)}
        >
          Generate Summaries
        </div>
      </div>
      <div>
        {isProduction ? (
          <ComingSoonBanner />
        ) : selectedFileIndex !== null &&
          files.length > 0 &&
          files[selectedFileIndex].extractState !== ExtractState.DONE_EXTRACTING ? (
          <div className="flex flex-col items-center justify-center h-full overflow-auto">
            <div className="text-xl font-semibold text-neutral-500">Please extract the data first.</div>
          </div>
        ) : (
          <>{transformMethod === TransformMethod.SUMMARIZE && !isProduction && <ComingSoonBanner />}</>
        )}
      </div>
    </div>
  );
};

export default TransformContainer;
