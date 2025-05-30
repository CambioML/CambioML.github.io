import { en } from './translations/en';

export type Locale =
  | 'en'
  | 'es'
  | 'fr'
  | 'zh'
  | 'de'
  | 'ja'
  | 'pt'
  | 'ru'
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
  | 'ro';

export const translations = {
  en,
  // es,
  // fr,
  // zh,
  // de,
  // ja,
  // pt,
  // ru,
  // it,
  // ar,
  // ko,
  // nl,
  // hi,
  // tr,
  // sv,
  // pl,
  // no,
  // da,
  // fi,
  // cs,
  // hu,
  // ro,
} as const;

export function getTranslation(locale: Locale) {
  console.log(locale, "i18n hasn't been implement yet");
  return translations.en;
}
