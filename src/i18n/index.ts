import es from './es.json';
import ca from './ca.json';

const translations: Record<string, typeof es> = { es, ca };

export const defaultLocale = 'es';
export const locales = ['es', 'ca'] as const;
export type Locale = (typeof locales)[number];

export function getTranslations(locale: string): typeof es {
  return translations[locale] || translations[defaultLocale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale)) {
    return lang as Locale;
  }
  return defaultLocale;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

export function getLocaleLabels(): Record<Locale, string> {
  return {
    es: 'Castellano',
    ca: 'Català',
  };
}
