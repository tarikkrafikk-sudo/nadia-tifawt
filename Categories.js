import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/Ornament';
import { CATEGORIES, CATEGORY_I18N } from '@/lib/catalog';
import { getI18n } from '@/lib/i18n/server';

// Visuels « terroir » : produits avec l'étiquette kraft et le logo NADIA TIFAWT (format 4:5, pot dans la partie haute)
const IMG = {
  zoyout: '/images/terroir/huile-argan.jpg',
  amlou: '/images/terroir/amlou.jpg',
  miel: '/images/terroir/miel-pur.jpg',
  tbrima: '/images/products/masque-miel-ghassoul.jpg',
};
// Visuels « pot » (pot en bas de l'image) : on remonte l'image pour que le pot reste au-dessus du titre
const SHIFT = { tbrima: 'absolute inset-x-0 -top-[24%] bottom-[24%]' };

export default function Categories() {
  const { t, locale } = getI18n();
  const tr = (c) => ({ ...c, ...(CATEGORY_I18N[c.slug]?.[locale] || {}) });
  return (
    <section className="relative py-24">
      <div className="container">
        <SectionTitle eyebrow={t('cats.eyebrow')} title={t('cats.title')} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(tr).map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.12}>
              <Link href={`/boutique?categorie=${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] border border-gold-500/20 transition duration-700 hover:-translate-y-1 hover:border-gold-400 hover:shadow-gold lg:aspect-[3/4]">
                <div className="absolute inset-0 overflow-hidden bg-forest-950">
                  <div className={SHIFT[c.slug] || 'absolute inset-0'}>
                  <Image src={IMG[c.slug]} alt={c.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover object-top transition duration-[1.4s] lg:group-hover:scale-110" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 from-22% via-forest-950/55 via-36% to-transparent to-50%" />
                <span aria-hidden="true" className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-gold-400/50 bg-forest-950/60 text-2xl shadow-gold backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:border-gold-300">{c.icon}</span>
                {/* Nom arabe en coin haut (zone de fond flou) : ne chevauche jamais le pot, même si le titre passe sur 2 lignes */}
                {locale !== 'ar' && <p dir="rtl" lang="ar" className="absolute end-4 top-6 rounded-full bg-forest-950/50 px-3 py-0.5 font-arabic text-base text-gold-300/90 backdrop-blur-sm">{c.nameAr}</p>}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-3xl leading-tight text-cream lg:text-[26px] xl:text-3xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-cream/65">{c.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300">
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
