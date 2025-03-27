import { En, TranslateDictionary, TranslateKeys } from '../lang/en.js';

const translationsLanguages = {
  en: En,
};

let currentLanguage = globalThis.navigator?.language.split('-')[0] || 'en';

export const setLanguage = (langCode: string) => {
  currentLanguage = langCode;
};

export const addTranslation = (
  langCode: string,
  languageDictionary: TranslateDictionary
) => {
  translationsLanguages[langCode] = languageDictionary;
};

export const t = (
  key: TranslateKeys,
  variables: Record<string, string | number> = {}
) => {
  const result = translationsLanguages[currentLanguage]?.[key] || En[key];

  return result.replace(/\{(\w+)\}/g, (_, varName) =>
    variables[varName] !== undefined
      ? String(variables[varName])
      : `{${varName}}`
  );
};
