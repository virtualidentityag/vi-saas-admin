import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

import translationEng from "./locales/en/translation.json";
import translationDe from "./locales/de/translation.json";
import translationFr from "./locales/fr/translation.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(XHR)
  .use(LanguageDetector)
  .init({
    debug: false, // set to true for debugging
    fallbackLng: "de", // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    resources: {
      en: {
        translations: translationEng,
      },
      de: {
        translations: translationDe,
      },
      fr: {
        translations: translationFr,
      },
    },
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
  });

export default i18n;
