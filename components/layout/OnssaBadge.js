'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import QualitySeal from '@/components/ui/QualitySeal';
import { useI18n } from '@/context/I18nContext';

// Bandeau « attestation ONSSA » du pied de page — affiché seulement si renseigné dans /admin/parametres
export default function OnssaBadge({ onssa }) {
  const { t } = useI18n() || { t: (k) => k };
  if (!onssa?.enabled || !onssa?.number) return null;
  const type = t(`onssa.types.${onssa.type}`);
  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-forest-900 via-forest-800/80 to-forest-900 p-6 shadow-luxe sm:p-8">
        <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-start">
          <QualitySeal className="h-24 w-24 shrink-0 drop-shadow-[0_0_20px_rgba(212,175,55,.35)]" />
          <div className="flex-1">
            <p className="eyebrow">{t('onssa.eyebrow')}</p>
            <p className="mt-2 font-serif text-2xl text-cream sm:text-3xl">{onssa.type === 'Agrément sanitaire' ? t('onssa.approved') : t('onssa.authorized')}</p>
            <p className="mt-2 text-sm text-cream/65">
              {type} {t('onssa.number')} <b dir="ltr" className="font-mono tracking-wider text-gold-300">{onssa.number}</b>
              {onssa.activity && <> · {onssa.activity}</>}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-cream/40">{t('onssa.office')}</p>
          </div>
          <Link href="/qualite" className="btn-outline shrink-0">{t('onssa.see')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </div>
      </div>
    </div>
  );
}
