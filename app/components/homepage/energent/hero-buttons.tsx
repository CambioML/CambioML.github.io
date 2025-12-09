'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/use-translation';
import { useRouter } from 'next/navigation';

interface HeroButtonsProps {
  className?: string;
}

export function HeroButtons({ className }: HeroButtonsProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const handleTryForFree = () => {
    window.location.href = 'https://app.energent.ai';
  };

  const handleContactUs = () => {
    router.push(`/${locale}/pricing-rt`);
  };

  return (
    <div className={className}>
      <div className="flex bg-white dark:bg-card border border-border rounded-xl p-1 gap-1 shadow-soft backdrop-blur">
        <motion.button
          onClick={handleTryForFree}
          className="relative px-4 py-2 rounded-md text-md font-medium font-sans transition-all duration-200 bg-gray-200 dark:bg-secondary text-black dark:text-white hover:bg-gray-300 dark:hover:bg-secondary/80"
        >
          <span>{t.homepage.hero.tryFree || 'Try for Free'}</span>
        </motion.button>

        {/* Contact us button */}
        <motion.button
          onClick={handleContactUs}
          className="relative px-4 py-2 rounded-md text-md font-medium font-sans transition-all duration-200 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-black shadow-strong"
        >
          <span>{t.homepage.hero.getApi || 'Get API Access'}</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12h14m-7-7 7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
