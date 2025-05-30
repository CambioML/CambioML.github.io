'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Locale, getTranslation } from '@/lib/translations';
import { getLocaleFromPathname, getLocalizedPath, locales, languageNames, languageFlags } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
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
    const newPath = getLocalizedPath(pathname, locale);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-white"
        aria-label={t.common.language}
      >
        <Globe size={16} />
        <span className="hidden sm:inline text-sm">{languageFlags[currentLocale]}</span>
        <span className="hidden md:inline text-sm">{languageNames[currentLocale]}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl z-50 max-h-120 overflow-y-auto overscroll-contain"
          >
            <div className="py-2">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors duration-150 flex items-center gap-3 ${
                    currentLocale === locale ? 'text-blue-400 bg-blue-500/10' : 'text-white'
                  }`}
                >
                  <span className="text-base">{languageFlags[locale]}</span>
                  <span className="text-sm">{languageNames[locale]}</span>
                  {currentLocale === locale && <span className="ml-auto text-xs text-blue-400">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
