import { ar } from './translations/ar';
import { cs } from './translations/cs';
import { da } from './translations/da';
import { de } from './translations/de';
import { en } from './translations/en';
import { es } from './translations/es';
import { fi } from './translations/fi';
import { fr } from './translations/fr';
import { hi } from './translations/hi';
import { hu } from './translations/hu';
import { it } from './translations/it';
import { ja } from './translations/ja';
import { ko } from './translations/ko';
import { nl } from './translations/nl';
import { no } from './translations/no';
import { pl } from './translations/pl';
import { pt } from './translations/pt';
import { ro } from './translations/ro';
import { sv } from './translations/sv';
import { tr } from './translations/tr';
import { zh } from './translations/zh';
import { ru } from './translations/ru';

export type Locale =
  | 'en'
  | 'es'
  | 'fr'
  | 'zh'
  | 'de'
  | 'ja'
  | 'pt'
  | 'it'
  | 'ar'
  | 'ko'
  | 'nl'
  | 'hi'
  | 'tr'
  | 'sv'
  | 'pl'
  | 'no'
  | 'da'
  | 'fi'
  | 'cs'
  | 'hu'
  | 'ro'
  | 'ru';

export const translations = {
  en,
  es,
  fr,
  zh,
  de,
  ja,
  pt,
  it,
  ar,
  ko,
  nl,
  hi,
  tr,
  sv,
  pl,
  no,
  da,
  fi,
  cs,
  hu,
  ro,
  ru,
} as const;

export function getTranslation(locale: Locale) {
  return translations[locale as keyof typeof translations] || translations.en;
}
