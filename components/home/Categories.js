import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/Ornament';
import { CATEGORIES, CATEGORY_I18N } from '@/lib/catalog';
import { getI18n } from '@/lib/i18n/server';

// Visuels « terroir » : produits avec l'étiquette kraft et le logo NADIA TIFAWT (format 4:5, pot dans la partie haute)
const IMG = { miel: '/images/terroir/miel-pur.jpg', amlou: '/images/terroir/amlou.jpg', cosmetiques: '/images/terroir/huile-argan.jpg' };

export default function Categories() {
  const { t, locale } = getI18n();
  const tr = (c) => ({ ...c, ...(CATEGORY_I18N[c.slug]?.[locale] || {}) });
  return (
    <section className="relative py-24">
      <div className="container">
        <SectionTitle eyebrow={t('cats.eyebrow')} title={t('cats.title')} />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map(tr).map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.12}>
              <Link href={`/boutique?categorie=${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] md:aspect-[3/4] lg:aspect-[4/5] border border-gold-500/20 transition duration-700 hover:border-gold-400 hover:shadow-gold">
                <div className="absolute inset-0 overflow-hidden">
                  <Image src={IMG[c.slug]} alt={c.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-top transition duration-[1.4s] group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 from-22% via-forest-950/55 via-36% to-transparent to-50%" />
                {/* Nom arabe en coin haut (zone de fond flou) : ne chevauche jamais le pot, même si le titre passe sur 2 lignes */}
                {locale !== 'ar' && <p dir="rtl" lang="ar" className="absolute end-5 top-4 rounded-full bg-forest-950/50 px-3 py-0.5 font-arabic text-base text-gold-300/90 backdrop-blur-sm md:text-sm lg:end-6 lg:top-5 lg:text-lg">{c.nameAr}</p>}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-5 lg:p-7">
                  <h3 className="font-serif text-3xl leading-tight text-cream md:text-2xl lg:text-3xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-cream/65 md:text-xs lg:text-sm">{c.tagline}</p>
                  <span className="mt-5 inline-flex md:mt-3 lg:mt-5 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300">
                    {t('cats.explore')} <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
