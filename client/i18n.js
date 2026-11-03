import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


// The detector takes the last choice saved in this browser, otherwise the browser's language;
// after sign-in the account's language replaces it (AppLayout)
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 'uk' is the code of Ukrainian: browsers report it and Intl formats by it ('ua' is a country)
    supportedLngs: ['en', 'uk'],
    fallbackLng: 'en',
    backend: {
      // Absolute: a relative path would resolve against nested addresses and get index.html back
      loadPath: '/locales/{{lng}}/translation.json'
    },

    interpolation: {
      escapeValue: false,
    }
  });
export default i18n;
