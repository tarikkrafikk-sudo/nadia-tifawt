'use client';
import { Globe } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { LOCALES } from '@/lib/i18n/config';

const SHORT = { fr: 'FR', en: 'EN', ar: 'ع' };

export default function LanguageSwitcher({ variant = 'bar' }) {
  const { locale, setLocale, t } = useI18n();
  if (variant === 'menu') {
    return (
      <div className="flex gap-2" role="group" aria-label={t('lang.label')}>
        {LOCALES.map((l) => (
          <button key={l} onClick={() => setLocale(l)} lang={l} aria-pressed={l === locale}
            className={`flex-1 rounded-full border px-3 py-2.5 text-sm transition ${l === locale ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-gold-500/25 text-cream/70'}`}>
            {t(`lang.${l}`)}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('lang.label')}>
      <Globe className="h-3.5 w-3.5 opacity-70" aria-hidden />
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-1 opacity-30">|</span>}
          <button onClick={() => setLocale(l)} lang={l} title={t(`lang.${l}`)} aria-pressed={l === locale}
            className={`px-0.5 font-semibold transition ${l === locale ? 'text-gold-100' : 'opacity-60 hover:opacity-100'}`}>{SHORT[l]}</button>
        </span>
      ))}
    </div>
  );
}
