import { ui, defaultLang, showDefaultLang } from './ui';

export function useTranslatedPath(currentLang: keyof typeof ui) {
  return function translatePath(path: string, lang: string = currentLang) {
    return !showDefaultLang && lang === defaultLang ? path : `/${lang}${path}`
  }
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
