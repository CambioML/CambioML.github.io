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

    // Sync theme class from body to html element
    const syncTheme = () => {
      const bodyClasses = document.body.classList;
      if (bodyClasses.contains('dark')) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else if (bodyClasses.contains('light')) {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    };

    // Initial sync
    syncTheme();

    // Watch for theme changes on body
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
