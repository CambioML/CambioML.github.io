'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';
import Button from '../Button';

interface HeroButtonsProps {
  className?: string;
}

export function HeroButtons({ className }: HeroButtonsProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();

  const handleTrySandbox = () => {
    router.push(`/${locale}/anyparser`);
  };

  return (
    <div className={className}>
      <div className="w-full max-w-xs">
        <Button label={t.homepage.hero.tryFree} onClick={handleTrySandbox} id="hero-try-free" />
      </div>
    </div>
  );
}
