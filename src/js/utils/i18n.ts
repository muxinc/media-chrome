import { En, TranslateDictionary, TranslateKeys } from './translation/en.js';

const translationsLanguages = {
  en: En,
};

export const addTranslation = (
  langCode: string,
  languageDictionary: TranslateDictionary
) => {
  translationsLanguages[langCode] = languageDictionary;
};

export const t = (key: TranslateKeys) => {
  const getBrowserLanguage = () => navigator.language.split('-')[0] || 'en';
  const getPreferredLanguage = () => getBrowserLanguage();

  return translationsLanguages[getPreferredLanguage()]?.[key] || En[key];
};
