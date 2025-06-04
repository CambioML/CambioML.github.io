'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { getLocaleFromPathname, isRtlLocale } from '@/lib/i18n';

export default function HtmlAttributes() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname);
    const isRtl = isRtlLocale(locale);

    // Update HTML lang attribute
    document.documentElement.lang = locale;

    // Update HTML dir attribute
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    // Add/remove rtl class for easier CSS targeting
    if (isRtl) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [pathname]);

  return null;
}
