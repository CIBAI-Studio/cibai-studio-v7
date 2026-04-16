import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const I18N_DIR = join(__dirname, '..', 'i18n');

export type SectionKey = 'hero' | 'nav' | 'hud' | 'servicios' | 'proceso' | 'portfolio' | 'studio' | 'contacto' | 'footer' | 'meta';

export const sectionLabels: Record<SectionKey, string> = {
  hero: 'Página principal (Hero/Inicio)',
  nav: 'Navegación',
  hud: 'Barra HUD',
  servicios: 'Servicios',
  proceso: 'Proceso',
  portfolio: 'Portfolio / Casos de éxito',
  studio: 'Studio',
  contacto: 'Contactar',
  footer: 'Pie de página',
  meta: 'SEO / Metadatos',
};

export function loadTranslations(locale: string): Record<string, any> {
  const filePath = join(I18N_DIR, `${locale}.json`);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function saveTranslations(locale: string, data: Record<string, any>) {
  const filePath = join(I18N_DIR, `${locale}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export function updateSection(locale: string, section: SectionKey, sectionData: any) {
  const all = loadTranslations(locale);
  all[section] = sectionData;
  saveTranslations(locale, all);
}

export function getSection(locale: string, section: SectionKey): any {
  const all = loadTranslations(locale);
  return all[section] || {};
}

export function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'string') {
      result[fullKey] = obj[key];
    } else if (Array.isArray(obj[key])) {
      // Skip arrays - they are handled specially in the admin UI
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    }
  }
  return result;
}

export function unflattenObject(flat: Record<string, string>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}
