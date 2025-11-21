'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/use-translation';

interface HeroButtonsProps {
  className?: string;
}

export function HeroButtons({ className }: HeroButtonsProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();

  const handleTrySandbox = () => {
    router.push(`/${locale}/anyparser`);
  };

  const handleGetApiKey = () => {
    router.push(`/${locale}/account`);
  };

  const handleBookDemo = () => {
    router.push('/book-demo');
  };

  return (
    <div className={className}>
      {/* Main action buttons */}
      <div className="flex bg-card-1 border border-gray-200 dark:border-border-1 rounded-xl p-1.5 gap-1.5 shadow-lg dark:shadow-[0px_0px_8px_2px_rgba(112,190,250,0.2)] backdrop-blur w-full">
        {/* Try Sandbox button */}
        <button
          onClick={handleTrySandbox}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 shadow-md hover:shadow-lg text-white"
        >
          {t.homepage.hero.tryFree}
        </button>

        {/* Get API Key button */}
        <button
          onClick={handleGetApiKey}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span>{t.homepage.hero.getApi}</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12h14m-7-7 7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Book Demo button - separate below */}
      <button
        onClick={handleBookDemo}
        className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
      >
        {t.homepage.hero.bookDemo}
      </button>
    </div>
  );
}
