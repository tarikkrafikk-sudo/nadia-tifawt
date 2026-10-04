import Link from 'next/link';
import Yaz from './Yaz';
import { Ornament } from './Ornament';
import { getI18n } from '@/lib/i18n/server';

export default function PageHeader({ title, eyebrow, crumbs = [], children }) {
  const { t } = getI18n();
  return (
    <section className="bokeh relative overflow-hidden border-b border-gold-500/15 bg-[radial-gradient(ellipse_at_50%_20%,rgba(35,79,51,.35),transparent_70%)]">
      <div className="amazigh-pattern absolute inset-0" />
      <Yaz className="absolute -end-10 -top-10 h-72 w-72 text-gold-500/[0.05]" strokeWidth={3} />
      <div className="container relative py-14 text-center sm:py-20">
        <nav aria-label={t('crumbs.aria')} className="mb-5 text-[11px] uppercase tracking-[0.25em] text-cream/50">
          <Link href="/" className="hover:text-gold-300">{t('crumbs.home')}</Link>
          {crumbs.map(([l, h]) => (
            <span key={l}> <span className="mx-2 text-gold-500">/</span>{h ? <Link href={h} className="hover:text-gold-300">{l}</Link> : <span className="text-cream/80">{l}</span>}</span>
          ))}
        </nav>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-gold-metal font-serif text-5xl font-medium sm:text-6xl">{title}</h1>
        <Ornament className="mt-6" />
        {children}
      </div>
    </section>
  );
}
