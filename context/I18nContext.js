'use client';
import { createContext, useContext, useMemo } from 'react';
import { makeT, dirOf, formatPrice, localizeProduct, LOCALE_COOKIE } from '@/lib/i18n/config';

const I18nContext = createContext(null);

export function I18nProvider({ locale, children }) {
  const value = useMemo(() => ({
    locale,
    dir: dirOf(locale),
    t: makeT(locale),
    price: (n) => formatPrice(n, locale),
    lp: (p) => localizeProduct(p, locale),
    setLocale: (l) => {
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
      window.location.reload();
    },
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
