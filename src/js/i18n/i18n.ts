import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import ptTranslation from './locales/pt.json';
import frTranslation from './locales/fr.json';

export const initI18n = () => {
  i18next.use(LanguageDetector).init({
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'localStorage', 'cookie', 'querystring'],
      caches: ['localStorage', 'cookie'],
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18next;
