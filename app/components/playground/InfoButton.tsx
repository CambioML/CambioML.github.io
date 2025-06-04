import useInfoModal from '@/app/hooks/useInfoModal';
import { Question } from '@phosphor-icons/react';
import { PlaygroundTabs } from '@/app/types/PlaygroundTypes';
import { useTranslation } from '@/lib/use-translation';

interface InfoButtonProps {
  infoType: string;
}

const textStyle = 'text-lg text-neutral-700 flex flex-col gap-2';
const h1Style = 'text-2xl font-semibold';
const h2Style = 'text-xl font-semibold pt-4';

const InfoButton = ({ infoType }: InfoButtonProps) => {
  const infoModal = useInfoModal();
  const { t } = useTranslation();

  const getInfoContent = () => {
    switch (infoType) {
      case PlaygroundTabs.PLAIN_TEXT:
        return (
          <>
            <div className={h1Style}>{t.playground.info.plainText.title}</div>
            <div className={textStyle}>
              <div>{t.playground.info.plainText.description}</div>
              <div>{t.playground.info.plainText.howTo}</div>
            </div>
            <div className={h2Style}>{t.playground.info.plainText.nextSteps}</div>
            <div className={textStyle}>{t.playground.info.plainText.nextStepsDescription}</div>
          </>
        );
      case PlaygroundTabs.TABLE:
        return (
          <>
            <div className={h1Style}>{t.playground.info.table.title}</div>
            <div className={textStyle}>
              <div>{t.playground.info.table.description}</div>
            </div>
            <div className={h2Style}>{t.playground.info.table.step1}</div>
            <div className={textStyle}>{t.playground.info.table.step1Description}</div>
            <div className={h2Style}>{t.playground.info.table.step2}</div>
            <div className={textStyle}>{t.playground.info.table.step2Description}</div>
            <div className={h2Style}>{t.playground.info.table.step3}</div>
            <div className={textStyle}>{t.playground.info.table.step3Description}</div>
            <div className={h2Style}>{t.playground.info.table.nextSteps}</div>
            <div className={textStyle}>{t.playground.info.table.nextStepsDescription}</div>
          </>
        );
      case PlaygroundTabs.KEY_VALUE_PAIR:
        return (
          <>
            <div className={h1Style}>{t.playground.info.keyValuePair.title}</div>
            <div className={textStyle}>
              <div>{t.playground.info.keyValuePair.description}</div>
              <div>{t.playground.info.keyValuePair.howTo}</div>
            </div>
            <div className={h2Style}>{t.playground.info.keyValuePair.nextSteps}</div>
            <div className={textStyle}>{t.playground.info.keyValuePair.nextStepsDescription}</div>
          </>
        );
      default:
        return <div></div>;
    }
  };

  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    infoModal.setContent(getInfoContent());
    infoModal.onOpen();
  };

  return (
    <button
      onClick={handleInfoClick}
      className="w-fit h-fit hover:text-cambio-red rounded-full text-neutral-700 p-1 font-bold transition duration-300"
    >
      <Question size={18} weight="bold" />
    </button>
  );
};

export default InfoButton;
