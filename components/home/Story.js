import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import Yaz from '@/components/ui/Yaz';
import { Ornament } from '@/components/ui/Ornament';
import { getI18n } from '@/lib/i18n/server';


export default function Story() {
  const { t } = getI18n();
  const STEPS = t('story.steps').map(([tt, d], i) => ({ n: `0${i + 1}`, t: tt, d }));
  return (
    <section id="histoire" className="relative scroll-mt-28 overflow-hidden py-28">
      <div className="amazigh-pattern absolute inset-0 opacity-60" />
      <div className="container relative grid items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold-500/40 p-3">
            <div className="relative h-full w-full overflow-hidden rounded-t-full">
              <Image src="/images/emblem-square.jpg" alt={t('story.imgAlt')} fill sizes="(max-width:1024px) 90vw, 520px"
                className="object-cover object-[35%_50%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute -bottom-8 -end-4 grid h-32 w-32 place-items-center rounded-full border border-gold-500/40 bg-forest-950/70 text-center backdrop-blur-md shadow-luxe sm:-end-8">
            <div>
              <Yaz className="mx-auto h-8 w-8 text-gold-400" strokeWidth={7} />
              <p className="mx-auto mt-1 max-w-[90px] text-[9px] uppercase tracking-[0.25em] text-cream/70 rtl:text-[11px]">{t('story.handmade')}</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal><span className="eyebrow">{t('story.eyebrow')}</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-cream sm:text-6xl">
              {t('story.title1')} <br /><span className="text-gold-metal italic">{t('story.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[15px] leading-relaxed text-cream/70">
              {t('story.text')}
            </p>
          </Reveal>
          <Ornament className="my-10 !justify-start" symbol />
          <div className="space-y-7">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.15 * i} className="flex gap-6">
                <span className="font-serif text-4xl text-gold-500/60">{s.n}</span>
                <div><h3 className="font-serif text-2xl text-cream">{s.t}</h3><p className="mt-1 text-sm leading-relaxed text-cream/60">{s.d}</p></div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}><Link href="/boutique" className="btn-gold mt-10">{t('story.cta')}</Link></Reveal>
        </div>
      </div>
    </section>
  );
}
