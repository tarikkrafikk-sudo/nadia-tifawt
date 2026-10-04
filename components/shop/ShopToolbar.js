'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, CATEGORY_I18N } from '@/lib/catalog';
import { useI18n } from '@/context/I18nContext';

const SORT_KEYS = ['featured', 'rating', 'price-asc', 'price-desc', 'newest'];
const PRICE_VALUES = ['', '150', '250', '400'];

export default function ShopToolbar({ total }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();
  const { t, locale } = useI18n();
  const [q, setQ] = useState(sp.get('q') || '');
  const cat = sp.get('categorie') || '';

  const set = (k, v) => {
    const p = new URLSearchParams(sp.toString());
    v ? p.set(k, v) : p.delete(k);
    start(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }));
  };

  useEffect(() => {
    const t = setTimeout(() => { if ((sp.get('q') || '') !== q) set('q', q); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className={`space-y-6 transition-opacity ${pending ? 'opacity-60' : ''}`}>
      {/* Catégories */}
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {[{ slug: '', name: t('shop.allTab') }, ...CATEGORIES.map((c) => ({ ...c, ...(CATEGORY_I18N[c.slug]?.[locale] || {}) }))].map((c) => (
          <button key={c.slug} onClick={() => set('categorie', c.slug)}
            className={`shrink-0 rounded-full border px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
              cat === c.slug ? 'border-gold-400 bg-gold-metal text-forest-900 shadow-gold' : 'border-gold-500/30 text-cream/75 hover:border-gold-400 hover:text-gold-300'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Filtres */}
      <div className="card-lux flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">{t('nav.search')}</span>
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('shop.search')} className="input-lux border-transparent bg-transparent ps-11" />
        </label>
        <div className="grid grid-cols-2 items-center gap-3 sm:flex">
          <SlidersHorizontal className="hidden h-4 w-4 text-gold-500 sm:block" />
          <select aria-label={t('shop.price')} value={sp.get('prix') || ''} onChange={(e) => set('prix', e.target.value)} className="input-lux py-2.5 text-sm sm:w-44">
            {PRICE_VALUES.map((v, i) => <option key={v} value={v} className="bg-forest-900">{t('shop.prices')[i]}</option>)}
          </select>
          <select aria-label={t('shop.sort')} value={sp.get('tri') || 'featured'} onChange={(e) => set('tri', e.target.value)} className="input-lux py-2.5 text-sm sm:w-48">
            {SORT_KEYS.map((v) => <option key={v} value={v} className="bg-forest-900">{t(`shop.sorts.${v}`)}</option>)}
          </select>
        </div>
      </div>
      <p className="text-center text-xs uppercase tracking-[0.25em] text-cream/50">{t('shop.count', { n: total })}</p>
    </div>
  );
}
