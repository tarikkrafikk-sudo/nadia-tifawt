import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MapPin, Phone, Mail, Facebook, Music2 } from 'lucide-react';
import Yaz from '@/components/ui/Yaz';
import { Ornament } from '@/components/ui/Ornament';
import { SITE, waLink } from '@/lib/utils';
import { getSettings } from '@/lib/data';
import { getI18n } from '@/lib/i18n/server';
import OnssaBadge from './OnssaBadge';
import QualityPromise from './QualityPromise';

export default async function Footer() {
  const { onssa, company: co } = await getSettings();
  const { t, locale } = getI18n();
  const COLS = [
    { title: t('footer.shop'), links: [[t('card.cat.zoyout'), '/boutique?categorie=zoyout'], [t('card.cat.amlou'), '/boutique?categorie=amlou'], [t('card.cat.miel'), '/boutique?categorie=miel'], [t('card.cat.tbrima'), '/boutique?categorie=tbrima'], [t('footer.bestsellers'), '/boutique?tri=rating']] },
    { title: t('footer.house'), links: [[t('nav.story'), '/notre-histoire'], [t('footer.reviews'), '/#avis'], [t('footer.quality'), '/qualite'], [t('footer.shipping'), '/checkout'], [t('footer.contact'), waLink(t('wa.hello'))]] },
  ];

  return (
    <footer className="amazigh-pattern relative overflow-hidden border-t border-gold-500/20 bg-forest-950/75 backdrop-blur-md">
      <div className="pt-14"><QualityPromise /></div>
      {onssa?.enabled && onssa?.number && <div className="pt-6"><OnssaBadge onssa={onssa} /></div>}
      <div className="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <span className="block h-16 w-16 rounded-full bg-gold-metal p-[2px]">
              <Image src="/images/emblem.png" alt="NADIA TIFAWT" width={128} height={128} className="h-full w-full rounded-full" />
            </span>
            <div className="latin" dir="ltr">
              <p className="text-gold-metal font-serif text-3xl font-semibold tracking-[0.12em]">NADIA</p>
              <p className="text-[11px] tracking-[0.55em] text-gold-400">TIFAWT</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60">{t('footer.about')}</p>
          {locale !== 'ar' && <p dir="rtl" lang="ar" className="mt-3 w-fit font-arabic text-lg text-gold-300/80">عسل، أملو ومستحضرات طبيعية من قلب الأطلس</p>}
          <div className="mt-6 flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 text-gold-300 transition hover:bg-gold-500 hover:text-forest-900"><Instagram className="h-4 w-4" /></a>
            <a href={SITE.tiktok} target="_blank" rel="noopener" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 text-gold-300 transition hover:bg-gold-500 hover:text-forest-900"><Music2 className="h-4 w-4" /></a>
            <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 text-gold-300 transition hover:bg-gold-500 hover:text-forest-900"><Facebook className="h-4 w-4" /></a>
            <a href={waLink(t('wa.hello'))} target="_blank" rel="noopener" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 text-gold-300 transition hover:bg-gold-500 hover:text-forest-900"><Phone className="h-4 w-4" /></a>
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="eyebrow mb-5">{c.title}</h3>
            <ul className="space-y-3">
              {c.links.map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-cream/65 transition hover:text-gold-300">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="grid gap-4 border-y border-gold-500/10 py-6 text-sm text-cream/60 sm:grid-cols-3">
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-500" /> <span>{t('footer.whatsapp', { p: '' })}<span dir="ltr">06 26 82 93 00</span></span></p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-500" /> {t('footer.cities')}</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-500" /> contact@nadiatifawt.ma</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-4 pb-28 pt-10 lg:pb-10">
        <Ornament />
        <Yaz className="h-14 w-14 text-gold-400 drop-shadow-[0_0_18px_rgba(212,175,55,.45)]" strokeWidth={6} title={t('footer.yaz')} />
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-cream/40">{t('footer.rights', { y: new Date().getFullYear() })}</p>
        {co?.showInFooter && (co.ice || co.taxId) && (
          <p className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-cream/40">
            <span>{co.tradeName}{co.status ? ` · ${t(`legal.statuses.${co.status}`)}` : ''}</span>
            {co.ice && <span>· ICE <span dir="ltr" className="font-mono">{co.ice}</span></span>}
            {co.taxId && <span>· IF <span dir="ltr" className="font-mono">{co.taxId}</span></span>}
            {co.tp && <span>· TP <span dir="ltr" className="font-mono">{co.tp}</span></span>}
            <span>· <Link href="/mentions-legales" className="underline-offset-4 hover:text-gold-300 hover:underline">{t('legal.link')}</Link></span>
          </p>
        )}
      </div>
    </footer>
  );
}
