'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WaIcon } from '@/components/layout/WhatsAppButton';
import { useI18n } from '@/context/I18nContext';
import { waLink } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1];
const PHONE = '0626829300';

// Paillettes dorées : positions déterministes (pas d'écart serveur/client à l'hydratation)
const PARTICLES = Array.from({ length: 34 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    top: `${(35 + r(2) * 65).toFixed(2)}%`,
    size: 2 + Math.round(r(3) * 5),
    dur: `${(7 + r(4) * 9).toFixed(1)}s`,
    delay: `-${(r(5) * 14).toFixed(1)}s`,
    blur: r(6) > 0.7,
  };
});

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-124px)] items-center justify-center overflow-hidden"
      aria-label={t('hero.srTitle')}
    >
      {/* Voile pour la lisibilité (le fond émeraude global est posé sur <body>) */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(10,46,31,.6)_0%,rgba(10,46,31,.2)_60%,transparent_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-t from-[#06170e]/70 to-transparent" />
      
      {/* Particules dorées */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 motion-reduce:hidden">
        {PARTICLES.map((p, i) => (
          <span key={i}
            className={`absolute rounded-full bg-gold-100 shadow-[0_0_10px_3px_rgba(212,175,55,.65)] animate-rise ${p.blur ? 'blur-[1.5px]' : ''}`}
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }} />
        ))}
      </div>

      {/* Contenu central */}
      <div className="container relative flex flex-col items-center py-6 text-center sm:py-8">
        <h1 className="sr-only">{t('hero.srTitle')}</h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.6, ease: EASE }}
          className="relative w-[min(94vw,calc((100svh-290px)*1.19),680px)] min-w-[280px]"
        >
          {/* halo doré qui respire */}
          <div aria-hidden className="absolute inset-[14%] -z-10 animate-glow rounded-full bg-gold-400/25 blur-3xl motion-reduce:animate-none" />
          <div className="animate-float motion-reduce:animate-none">
            <Image
              src="/hero/logo-nadia-tifawt.webp" alt="NADIA TIFAWT — Miel · Cosmétiques · Naturel"
              width={1174} height={988} priority sizes="(max-width:640px) 92vw, 640px"
              className="h-auto w-full select-none mix-blend-lighten drop-shadow-[0_0_40px_rgba(212,175,55,.18)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7, ease: EASE }}
          className="mt-2 flex flex-col items-center gap-4 sm:mt-3"
        >
          {/* Bouton WhatsApp façon référence : capsule verte bordée d'or */}
          <a href={waLink(t('wa.hello'))} target="_blank" rel="noopener" dir="ltr"
            aria-label={`WhatsApp ${PHONE}`}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-b from-[#0f3a22] to-[#07200f] p-1.5 pe-6 shadow-[0_0_0_1.5px_#D4AF37,0_0_0_4px_rgba(212,175,55,.18),0_18px_40px_-12px_rgba(212,175,55,.55)] transition duration-500 hover:scale-[1.04] hover:shadow-[0_0_0_1.5px_#F3E3B0,0_0_0_5px_rgba(212,175,55,.3),0_18px_50px_-10px_rgba(212,175,55,.8)] sm:gap-4 sm:pe-8"
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#2fd36b] to-[#128a3c] text-white ring-2 ring-white/80 sm:h-14 sm:w-14">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/35 motion-reduce:hidden" />
              <WaIcon className="relative h-6 w-6 sm:h-8 sm:w-8" />
            </span>
            <span className="text-gold-shine font-serif text-[26px] font-semibold leading-none tracking-wide sm:text-[36px]">{PHONE}</span>
          </a>

          <Link href="/boutique" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-300/85 underline-offset-8 transition hover:text-gold-100 hover:underline">
            {t('hero.cta')}
          </Link>
        </motion.div>
      </div>

      <a href="#best" aria-hidden tabIndex={-1} className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-gold-400/70 sm:block">
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
