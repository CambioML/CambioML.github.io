import { Info, Question } from '@phosphor-icons/react';
import SimpleButton from '../SimpleButton';
import usePlaygroundFeedbackModal from '@/app/hooks/usePlaygroundFeedbackModal';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';

const PlaygroundInfoBar = () => {
  const playgroundFeedbackModal = usePlaygroundFeedbackModal();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="w-full h-[100px] p-4 bg-white/10 backdrop-blur-sm text-gray-800 grid grid-cols-[1fr_150px] gap-4 border-t-[1px] border-white/20">
      <div className="flex items-center gap-2">
        <Info size={32} className="shrink-0" />
        <div className="flex flex-col gap-0">
          <div className="whitespace-pre-line italic">{t.playground.disclaimers.pageLimit}</div>
          <div className="whitespace-pre-line italic">
            <span>{t.playground.disclaimers.fileSize}</span>
            &nbsp;
            <span
              className="underline underline-offset-2 cursor-pointer hover:text-cambio-red"
              onClick={() => router.push('/legal/privacy-policy.pdf')}
            >
              {t.playground.disclaimers.privacyPolicy}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <SimpleButton
          label={t.playground.feedback.button}
          labelIcon={Question}
          onClick={playgroundFeedbackModal.onOpen}
          small
        />
      </div>
    </div>
  );
};

export default PlaygroundInfoBar;
