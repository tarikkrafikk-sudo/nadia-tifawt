'use client';
import { BadgeCheck, MessageCircle } from 'lucide-react';
import Stars from '@/components/ui/Stars';
import { useI18n } from '@/context/I18nContext';

// Un avis client : note, texte, photos, badge « Achat vérifié », réponse de la marque
export default function ReviewItem({ r }) {
  const { t, locale } = useI18n();
  return (
    <li className="card-lux p-5">
      <div className="flex items-center justify-between gap-3"><b className="text-cream">{r.name}</b><Stars value={r.rating} size={12} /></div>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-cream/40">
        <span>{[r.city, new Date(r.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-GB' : 'fr-MA')].filter(Boolean).join(' · ')}</span>
        {r.verified && <span className="inline-flex items-center gap-1 rounded-full bg-forest-600/60 px-2 py-0.5 normal-case tracking-normal text-gold-200"><BadgeCheck className="h-3.5 w-3.5" /> {t('rv.verified')}</span>}
        {r.source && r.source !== 'site' && <span className="inline-flex items-center gap-1 normal-case tracking-normal"><MessageCircle className="h-3 w-3" /> {t(`rv.via.${r.source}`)}</span>}
      </p>
      <p className="mt-3 text-sm">{r.text}</p>
      {r.photos?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {r.photos.map((src) => (
            <a key={src} href={src} target="_blank" rel="noopener" aria-label={t('rv.seePhoto')} className="block h-20 w-20 overflow-hidden rounded-lg border border-gold-500/25 transition hover:border-gold-400">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}
      {r.reply && <p className="mt-3 border-s-2 border-gold-500/60 ps-3 text-xs italic text-gold-200/80"><b className="not-italic text-gold-300">{t('product.reply')}</b> {r.reply}</p>}
    </li>
  );
}
