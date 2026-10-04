import Link from 'next/link';
import { Leaf, ScanSearch, PackageCheck, MapPin, ArrowRight } from 'lucide-react';
import Yaz from '@/components/ui/Yaz';
import { getI18n } from '@/lib/i18n/server';

const ICONS = [Leaf, ScanSearch, PackageCheck, MapPin];

// Bandeau « Engagement qualité » du pied de page (engagements de la marque, sans certification)
export default function QualityPromise() {
  const { t } = getI18n();
  const items = t('promise.items');
  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl bg-gold-metal p-[1.5px] shadow-luxe">
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 px-5 py-8 sm:px-10 sm:py-10">
          <Yaz className="pointer-events-none absolute -end-10 -top-10 h-56 w-56 text-gold-500/[0.06]" strokeWidth={3} />
          <div className="pointer-events-none absolute -start-20 bottom-0 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-3 text-center lg:flex-row lg:justify-between lg:text-start">
            <div>
              <p className="eyebrow">{t('promise.eyebrow')}</p>
              <p className="mt-2 font-serif text-2xl text-cream sm:text-3xl">{t('promise.title')}</p>
            </div>
            <Link href="/qualite" className="btn-outline shrink-0 py-2.5">{t('promise.more')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </div>

          <div className="gold-line relative my-7 opacity-60" />

          <ul className="relative grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
            {items.map(([title, sub], i) => {
              const I = ICONS[i];
              return (
                <li key={title} className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-start">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-forest-950/60 text-gold-300 shadow-[0_0_20px_-6px_rgba(212,175,55,.5)]">
                    <I className="h-5 w-5" strokeWidth={1.4} />
                  </span>
                  <span>
                    <b className="block text-[13px] font-semibold text-cream sm:text-sm">{title}</b>
                    <span className="text-[11px] text-cream/55 sm:text-xs">{sub}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
