import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import de from './locales/de';
import zh from './locales/zh';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      zh: { translation: zh }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    debug: false, // Set to true for debugging
    
    // Disable automatic language detection since we handle it with LanguageContext
    detection: {
      order: [],
    },
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
  });

export default i18n;
