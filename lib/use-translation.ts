'use client';

import { usePathname } from 'next/navigation';
import { getTranslation } from './translations';
import { getLocaleFromPathname } from './i18n';

export function useTranslation() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const t = getTranslation(currentLocale);

  return {
    t,
    locale: currentLocale,
    pathname,
  };
}
