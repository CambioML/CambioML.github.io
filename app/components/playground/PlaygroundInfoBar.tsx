import { Info, Question } from '@phosphor-icons/react';
import SimpleButton from '../SimpleButton';
import usePlaygroundFeedbackModal from '@/app/hooks/usePlaygroundFeedbackModal';
import { useRouter } from 'next/navigation';

const PlaygroundInfoBar = () => {
  const playgroundFeedbackModal = usePlaygroundFeedbackModal();
  const router = useRouter();
  return (
    <div className="w-full h-[100px] p-4 bg-white/10 backdrop-blur-sm text-gray-800 grid grid-cols-[1fr_150px] gap-4 border-t-[1px] border-white/20">
      <div className="flex items-center gap-2">
        <Info size={32} className="shrink-0" />
        <div className="flex flex-col gap-0">
          <div className="whitespace-pre-line italic">
            {`*For each uploaded file, we only process the first ten pages for better availability.`}
          </div>
          <div className="whitespace-pre-line italic">
            <span>{`**MAXIMUM FILE SIZE IS 10MB. Refreshing this page will clear all files and processed data since we don't store your data.`}</span>
            &nbsp;
            <span
              className="underline underline-offset-2 cursor-pointer hover:text-cambio-red"
              onClick={() => router.push('/anyparser-privacy-policy')}
            >
              View AnyParser privacy policy.
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <SimpleButton label="Feedback" labelIcon={Question} onClick={playgroundFeedbackModal.onOpen} small />
      </div>
    </div>
  );
};

export default PlaygroundInfoBar;
