import Link from 'next/link';
import { Users, HandHeart, Leaf } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import Yaz from '@/components/ui/Yaz';
import { Ornament } from '@/components/ui/Ornament';
import { WaIcon } from '@/components/layout/WhatsAppButton';
import { getI18n } from '@/lib/i18n/server';
import { waLink } from '@/lib/utils';

export async function generateMetadata() {
  const { t } = getI18n();
  return { title: t('storyPage.metaTitle'), description: t('storyPage.metaDesc'), alternates: { canonical: '/notre-histoire' } };
}

const ICONS = [Users, HandHeart, Leaf];

export default function NotreHistoirePage() {
  const { t } = getI18n();
  const paras = t('storyPage.paras');
  const values = t('storyPage.values');

  return (
    <>
      <PageHeader title={t('storyPage.metaTitle')} eyebrow="NADIA TIFAWT" crumbs={[[t('storyPage.metaTitle')]]} />

      {/* 2 colonnes : vidéo à gauche, histoire de la coopérative à droite */}
      <section className="container grid items-start gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-[520px] lg:sticky lg:top-32">
          {/* Vidéo stabilisée et recadrée sur le logo : sans filigrane « CapCut AI » ni bouton WhatsApp */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-gold-500/40 bg-forest-950/40 p-1.5 shadow-[0_30px_80px_-30px_rgba(212,175,55,.45)]">
            <div className="relative aspect-[720/748] overflow-hidden rounded-xl">
              <video
                autoPlay loop muted playsInline preload="metadata" poster="/videos/notre-histoire-poster.jpg"
                aria-label={t('storyPage.videoLabel')}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/videos/notre-histoire.mp4" type="video/mp4" />
                <source src="/videos/notre-histoire.webm" type="video/webm" />
              </video>
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_40px_rgba(5,22,15,.5)]" />
            </div>
          </div>
          <span aria-hidden className="absolute -bottom-5 -end-3 grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 bg-forest-950/80 text-gold-400 backdrop-blur-md sm:-end-5 sm:h-20 sm:w-20">
            <Yaz className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={7} />
          </span>
        </Reveal>

        <div className="rounded-3xl border border-gold-500/10 bg-forest-950/45 p-6 backdrop-blur-md sm:p-10">
          <Reveal><span className="eyebrow">{t('storyPage.eyebrow')}</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-cream sm:text-6xl">
              {t('storyPage.title1')} <br /><span className="text-gold-metal italic">{t('storyPage.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 font-serif text-2xl italic leading-snug text-gold-300">{t('storyPage.lead')}</p>
          </Reveal>
          <div className="mt-6 space-y-5">
            {paras.map((p, i) => (
              <Reveal key={i} delay={0.2 + i * 0.05}>
                <p className="text-[15px] leading-relaxed text-cream/75">{p}</p>
              </Reveal>
            ))}
          </div>

          <Ornament className="my-10 !justify-start" symbol />

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {values.map(([title, text], i) => {
              const I = ICONS[i];
              return (
                <Reveal key={title} delay={0.1 * i} className="glass rounded-2xl p-5">
                  <I className="h-6 w-6 text-gold-400" strokeWidth={1.4} />
                  <h3 className="mt-3 font-serif text-xl text-cream">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cream/60">{text}</p>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/boutique" className="btn-gold">{t('storyPage.cta')}</Link>
            <a href={waLink(t('wa.hello'))} target="_blank" rel="noopener" className="btn-outline"><WaIcon className="h-4 w-4" /> {t('storyPage.wa')}</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
