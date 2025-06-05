'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Locale, getTranslation } from '@/lib/translations';
import { getLocaleFromPathname, replaceLocaleInPath, locales, languageNames, languageFlags } from '@/lib/i18n';
import { cn } from '@/lib/cn';

interface LanguageSwitcherProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export function LanguageSwitcher({ className = '', theme = 'light' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = getLocaleFromPathname(pathname);
  const t = getTranslation(currentLocale);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    const newPath = replaceLocaleInPath(pathname, locale);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
          theme === 'dark'
            ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
            : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
        )}
        aria-label={t.common.language}
      >
        <Globe size={16} />
        <span className="hidden sm:inline text-sm">{languageFlags[currentLocale]}</span>
        <span className="hidden md:inline text-sm">{languageNames[currentLocale]}</span>
        <ChevronDown size={14} className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl z-40 max-h-[400px] overflow-y-auto overscroll-contain',
              theme === 'dark'
                ? 'bg-black/90 backdrop-blur-lg border border-white/10'
                : 'bg-white border border-gray-200'
            )}
          >
            <div className="py-2">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={cn(
                    'w-full px-4 py-2 text-left transition-colors duration-150 flex items-center gap-3',
                    theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-50',
                    currentLocale === locale
                      ? theme === 'dark'
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-blue-600 bg-blue-50'
                      : theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-700'
                  )}
                >
                  <span className="text-base">{languageFlags[locale]}</span>
                  <span className="text-sm">{languageNames[locale]}</span>
                  {currentLocale === locale && (
                    <span className={cn('ml-auto text-xs', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
