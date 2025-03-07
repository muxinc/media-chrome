import { En, TranslateDictionary, TranslateKeys } from '../lang/en.js';

const translationsLanguages = {
  en: En,
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
  const getBrowserLanguage = () => navigator.language.split('-')[0] || 'en';
  const getPreferredLanguage = () => getBrowserLanguage();

  const result =
    translationsLanguages[getPreferredLanguage()]?.[key] || En[key];

  return result.replace(/\{(\w+)\}/g, (_, varName) =>
    variables[varName] !== undefined
      ? String(variables[varName])
      : `{${varName}}`
  );
};
