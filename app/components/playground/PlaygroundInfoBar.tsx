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
    <div className="w-full h-[100px] p-4 bg-gray-100 dark:bg-white/10 backdrop-blur-sm border-t border-gray-300 dark:border-white/20 shadow-sm dark:shadow-none grid grid-cols-[1fr_150px] gap-4">
      <div className="flex items-center gap-2">
        <Info size={32} className="shrink-0 text-gray-700 dark:text-gray-300" />
        <div className="flex flex-col gap-0">
          <div className="whitespace-pre-line italic text-gray-700 dark:text-gray-300">
            {t.playground.disclaimers.pageLimit}
          </div>
          <div className="whitespace-pre-line italic text-gray-700 dark:text-gray-300">
            <span>{t.playground.disclaimers.fileSize}</span>
            &nbsp;
            <span
              className="underline underline-offset-2 cursor-pointer hover:text-red-600 dark:hover:text-cambio-red text-gray-800 dark:text-gray-200"
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
