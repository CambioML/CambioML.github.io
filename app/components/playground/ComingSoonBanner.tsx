import { Sparkle } from '@phosphor-icons/react';
import { useTranslation } from '@/lib/use-translation';

interface ComingSoonBannerProps {
  text?: string;
}

const ComingSoonBanner = ({ text }: ComingSoonBannerProps) => {
  const { t } = useTranslation();

  return (
    <div className="h-full w-full flex items-center justify-center p-4 border-solid border border-neutral-200 rounded-lg text-center font-semibold text-2xl text-neutral-800 gap-2">
      {text || t.playground.comingSoon}
      <Sparkle size={24} />
    </div>
  );
};

export default ComingSoonBanner;
