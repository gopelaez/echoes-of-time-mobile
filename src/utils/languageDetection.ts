import { Platform, NativeModules } from 'react-native';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const SUPPORTED_LANGUAGES: { [key in SupportedLanguage]: string } = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
};

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return lang in SUPPORTED_LANGUAGES;
}

export function detectUserLanguage(): SupportedLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    console.log('🌍 Detected device locale:', locale);
    const languageCode = locale.split('-')[0].toLowerCase();
    console.log('🌍 Extracted language code:', languageCode);

    if (isSupportedLanguage(languageCode)) {
      console.log('🌍 Using detected language:', languageCode);
      return languageCode;
    }

    console.log('🌍 Language not supported, falling back to English');
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Error detecting user language:', error);
    console.log('🌍 Using fallback language: English');
    return DEFAULT_LANGUAGE;
  }
}

export function getLanguageDisplayName(languageCode: SupportedLanguage): string {
  return SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
}
