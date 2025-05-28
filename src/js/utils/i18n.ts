import { En, TranslateDictionary, TranslateKeys } from '../lang/en.js';

const translations: Record<string, TranslateDictionary> = {
  en: En
};

let currentLang = globalThis.navigator?.language || 'en';

export const setLanguage = (langCode: string) => {
  currentLang = langCode;
};

export const addTranslation = (
  lang: string,
  languageDictionary: TranslateDictionary
) => {
  translations[lang] = languageDictionary;
};

const resolveTranslation = (key: TranslateKeys): string => {
  const [base] = currentLang.split('-');

  return (
    translations[currentLang]?.[key] ||
    translations[base]?.[key] ||
    translations.en?.[key] ||
    key
  );
};

export const t = (
  key: TranslateKeys,
  vars: Record<string, string | number> = {}
): string =>
  resolveTranslation(key).replace(/\{(\w+)\}/g, (_, v) =>
    v in vars ? String(vars[v]) : `{${v}}`
  );
