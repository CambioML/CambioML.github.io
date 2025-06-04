import { Envelope } from '@phosphor-icons/react';
import React from 'react';
import Button from '../Button';
import { useTranslation } from '@/lib/use-translation';

const textStyles = 'text-2xl font-semibold text-neutral-500 w-[500px] text-center';

const QuotaLimitPage = () => {
  const { t } = useTranslation();

  const handleContactClick = () => {
    window.location.href = `mailto:${t.playground.quota.contactEmail}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className={textStyles}>{t.playground.quota.limitReached}</div>
      <div className={textStyles}>{t.playground.quota.contactForMore}</div>
      <div className="w-[300px]">
        <Button label={t.playground.quota.contactEmail} onClick={handleContactClick} small labelIcon={Envelope} />
      </div>
    </div>
  );
};

export default QuotaLimitPage;
