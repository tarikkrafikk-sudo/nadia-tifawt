import { cookies, headers } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, makeT, dirOf, formatPrice, localizeProduct } from './config';

export function getLocale() {
  const h = headers().get('x-locale');
  if (isLocale(h)) return h;
  const c = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(c) ? c : DEFAULT_LOCALE;
}

export function getI18n() {
  const locale = getLocale();
  return {
    locale,
    dir: dirOf(locale),
    t: makeT(locale),
    price: (n) => formatPrice(n, locale),
    lp: (p) => localizeProduct(p, locale),
  };
}
