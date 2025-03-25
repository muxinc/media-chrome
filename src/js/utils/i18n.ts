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

export class I18n {
  private static instance: I18n;
  private currentLanguage: string;

  private constructor() {
    this.currentLanguage = globalThis.navigator?.language.split('-')[0] || 'en';
  }

  public static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }

  public setLanguage(langCode: string) {
    this.currentLanguage = langCode;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }
}

const i18n = I18n.getInstance();

export { i18n };

export const t = (
  key: TranslateKeys,
  variables: Record<string, string | number> = {}
) => {
  const result = translationsLanguages[i18n.getLanguage()]?.[key] || En[key];

  return result.replace(/\{(\w+)\}/g, (_, varName) =>
    variables[varName] !== undefined
      ? String(variables[varName])
      : `{${varName}}`
  );
};
