import { type Locale } from './translations';

export const locales: Locale[] = [
  'en',
  'es',
  'fr',
  'zh',
  'de',
  'ja',
  'pt',
  'ru',
  'it',
  'ar',
  'ko',
  'nl',
  'hi',
  'tr',
  'sv',
  'pl',
  'no',
  'da',
  'fi',
  'cs',
  'hu',
  'ro',
];
export const defaultLocale: Locale = 'en';

// Universal function for generating static params for locale-based pages
export function generateLocaleStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

// Language display names for UI components
export const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
  de: 'Deutsch',
  ja: '日本語',
  pt: 'Português',
  ru: 'Русский',
  it: 'Italiano',
  ar: 'العربية',
  ko: '한국어',
  nl: 'Nederlands',
  hi: 'हिंदी',
  tr: 'Türkçe',
  sv: 'Svenska',
  pl: 'Polski',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
};

// Flag emojis for language switcher
export const languageFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  zh: '🇨🇳',
  de: '🇩🇪',
  ja: '🇯🇵',
  pt: '🇵🇹',
  ru: '🇷🇺',
  it: '🇮🇹',
  ar: '🇸🇦',
  ko: '🇰🇷',
  nl: '🇳🇱',
  hi: '🇮🇳',
  tr: '🇹🇷',
  sv: '🇸🇪',
  pl: '🇵🇱',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
  cs: '🇨🇿',
  hu: '🇭🇺',
  ro: '🇷🇴',
};

// Storage key for locale preference
const LOCALE_STORAGE_KEY = 'energent-locale';

export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error);
  }

  return null;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to store locale in localStorage:', error);
  }
}

export function getPreferredLocale(): Locale {
  // First try to get from localStorage
  const stored = getStoredLocale();
  if (stored) return stored;

  // Then try to detect from browser
  if (typeof window !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (locales.includes(browserLang)) {
      return browserLang;
    }
  }

  return defaultLocale;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1] as Locale;

  if (locales.includes(potentialLocale)) {
    return potentialLocale;
  }

  // If no locale in pathname, try to get preferred locale
  return getPreferredLocale();
}

export function replaceLocaleInPath(pathname: string, newLocale: Locale): string {
  const segments = pathname.split('/');
  const currentLocale = segments[1] as Locale;

  if (locales.includes(currentLocale)) {
    // Replace the existing locale with the new one
    segments[1] = newLocale;
    return segments.join('/');
  }

  // If no locale found, add it as the first segment
  return `/${newLocale}${pathname}`;
}

// RTL (Right-to-Left) languages
export const rtlLocales: Locale[] = ['ar', 'hi']; // Arabic and Hindi

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getCurrentLocaleFromHeaders(): Locale {
  // In Next.js 13+, we can check the pathname from headers
  if (typeof window !== 'undefined') {
    return getLocaleFromPathname(window.location.pathname);
  }

  // Server-side fallback to default locale
  return defaultLocale;
}
