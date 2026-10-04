import { DICTS } from './dictionaries';

export const LOCALES = ['fr', 'ar', 'en'];
export const DEFAULT_LOCALE = 'fr';
export const LOCALE_COOKIE = 'lang';
export const isLocale = (l) => LOCALES.includes(l);
export const dirOf = (l) => (l === 'ar' ? 'rtl' : 'ltr');
export const HTML_LANG = { fr: 'fr-MA', ar: 'ar-MA', en: 'en' };

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

/** Crée la fonction t('a.b', { x }) pour une langue (repli sur le français). */
export function makeT(locale) {
  const dict = DICTS[locale] || DICTS.fr;
  return (key, params) => {
    let v = get(dict, key);
    if (v === undefined) v = get(DICTS.fr, key);
    if (v === undefined) return key;
    if (typeof v === 'string' && params) v = v.replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? `{${k}}`));
    return v;
  };
}

/** Prix formaté selon la langue : 390 DH · 390 MAD · 390 درهم */
export function formatPrice(n, locale = 'fr') {
  const num = new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA', { maximumFractionDigits: 0, numberingSystem: 'latn' }).format(n || 0);
  if (locale === 'en') return `${num} MAD`;
  if (locale === 'ar') return `${num} درهم`;
  return `${num} DH`;
}

/** Remplace les champs d'un produit par leur traduction (champ `i18n.en` / `i18n.ar`). */
export function localizeProduct(p, locale) {
  if (!p || locale === 'fr') return p;
  const tr = p.i18n?.[locale] || {};
  const out = { ...p, fr: { name: p.name, size: p.size } };
  for (const k of ['name', 'shortDescription', 'description', 'ingredients', 'usage', 'size']) if (tr[k]) out[k] = tr[k];
  if (locale === 'ar' && !tr.name && p.nameAr) out.name = p.nameAr;
  return out;
}
