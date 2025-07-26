import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en
  },
  fr: {
    translation: fr
  }
};

const initI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: localStorage.getItem('language') || 'en',
      fallbackLng: 'en',
      
      interpolation: {
        escapeValue: false
      },
      
      react: {
        useSuspense: true
      }
    });
};

initI18n();

export default i18n;