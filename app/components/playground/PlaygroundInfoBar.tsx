import { Info, Question } from '@phosphor-icons/react';
import SimpleButton from '../SimpleButton';
import usePlaygroundFeedbackModal from '@/app/hooks/usePlaygroundFeedbackModal';
import { useRouter } from 'next/navigation';

const PlaygroundInfoBar = () => {
  const playgroundFeedbackModal = usePlaygroundFeedbackModal();
  const router = useRouter();
  return (
    <div className="w-full h-fit p-4 rounded-xl bg-neutral-100 text-neutral-700 grid grid-cols-[1fr_150px] gap-4">
      <div className="flex items-center gap-2">
        <Info size={32} className="shrink-0" />
        <div className="flex flex-col gap-0">
          <div className="whitespace-pre-line italic">
            {`*For each uploaded file, we only process the first ten pages for better availability.`}
          </div>
          <div className="whitespace-pre-line italic">
            <span>{`**Refresh this page will clear all files and processed data since we don't store your data.`}</span>
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
