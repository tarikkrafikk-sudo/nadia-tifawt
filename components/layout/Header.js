'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Truck, LockKeyhole } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Yaz from '@/components/ui/Yaz';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { SITE, waLink } from '@/lib/utils';
import { WaIcon } from './WhatsAppButton';
import LanguageSwitcher from './LanguageSwitcher';

const NAV = [
  { href: '/', key: 'home' },
  { href: '/boutique?categorie=miel', key: 'honey' },
  { href: '/boutique?categorie=amlou', key: 'amlou' },
  { href: '/boutique?categorie=cosmetiques', key: 'cosmetics' },
  { href: '/notre-histoire', key: 'story' },
  { href: '/admin', key: 'admin', admin: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { count, setOpen, ready } = useCart();
  const { t, dir } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setMobile(false), [pathname]);

  return (
    <>
      {/* Bandeau d'annonce */}
      <div className="relative z-50 bg-forest-950/85 text-[11px] backdrop-blur-md tracking-[0.18em] text-gold-300/90">
        <div className="container flex h-9 items-center justify-between gap-3">
          <span className="hidden w-32 lg:block" />
          <span className="flex min-w-0 items-center gap-2 uppercase">
            <Truck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t('announce')}</span>
            <a href={waLink()} target="_blank" rel="noopener" dir="ltr" className="ms-3 hidden shrink-0 items-center gap-1.5 text-gold-100 hover:text-white lg:flex">
              <WaIcon className="h-3.5 w-3.5" /> {SITE.phoneDisplay}
            </a>
          </span>
          <span className="flex shrink-0 justify-end lg:w-32"><LanguageSwitcher /></span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled ? 'border-gold-500/25 bg-forest-950/80 shadow-luxe backdrop-blur-md' : 'border-gold-500/10 bg-forest-950/45 backdrop-blur-md'}`}>
        <div className={`container flex items-center justify-between gap-6 transition-all duration-500 ${scrolled ? 'h-[72px]' : 'h-[88px]'}`}>
          <button className="-ms-2 grid h-11 w-11 place-items-center text-gold-300 xl:hidden" onClick={() => setMobile(true)} aria-label={t('nav.openMenu')}>
            <Menu className="h-6 w-6" />
          </button>

          <Logo />

          <nav className="hidden items-center gap-6 xl:flex 2xl:gap-7" aria-label="Navigation">
            {NAV.map((n) => n.admin ? (
              <Link key={n.href} href={n.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-500 hover:text-forest-900">
                <LockKeyhole className="h-3.5 w-3.5" /> {t('nav.admin')}
              </Link>
            ) : (
              <Link key={n.href} href={n.href}
                className="group relative whitespace-nowrap py-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream/80 transition hover:text-gold-300 rtl:text-[15px]">
                {t(`nav.${n.key}`)}
                <span className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-gold-400 transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a href={waLink(t('wa.hello'))} target="_blank" rel="noopener" aria-label="WhatsApp" dir="ltr"
              className="hidden items-center gap-2 rounded-full border border-gold-500/50 px-4 py-2 text-[12px] font-semibold tracking-wide text-gold-300 transition hover:bg-[#1f8a45] hover:text-white 2xl:flex">
              <WaIcon className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
            <Link href="/boutique" aria-label={t('nav.search')} className="hidden rounded-full p-2 text-gold-300 transition hover:bg-gold-500/10 sm:block">
              <Search className="h-5 w-5" />
            </Link>
            <button onClick={() => setOpen(true)} aria-label={t('nav.cart', { n: count })}
              className="relative grid h-11 w-11 place-items-center rounded-full text-gold-300 transition hover:bg-gold-500/10">
              <ShoppingBag className="h-[22px] w-[22px]" />
              {ready && count > 0 && (
                <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }}
                  className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-cream ring-2 ring-forest-900">
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobile && (
          <motion.div className="fixed inset-0 z-[60] xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobile(false)} />
            <motion.aside initial={{ x: dir === 'rtl' ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: dir === 'rtl' ? '100%' : '-100%' }} transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="amazigh-pattern absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col bg-forest-900 p-6">
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setMobile(false)} aria-label={t('nav.close')} className="text-gold-300"><X className="h-6 w-6" /></button>
              </div>
              <div className="gold-line my-8" />
              <nav className="flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                    <Link href={n.href} className="flex items-center gap-3 border-b border-gold-500/10 py-4 font-serif text-2xl text-cream hover:text-gold-300">
                      {n.admin && <LockKeyhole className="h-5 w-5 text-gold-400" />}{t(`nav.${n.key}`)}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-8"><LanguageSwitcher variant="menu" /></div>
              <Yaz className="mx-auto mt-auto h-12 w-12 text-gold-500/40" strokeWidth={5} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
