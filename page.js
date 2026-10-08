import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getReviews } from '@/lib/data';
import { CATEGORIES, CATEGORY_I18N } from '@/lib/catalog';
import { SITE } from '@/lib/utils';
import { getI18n } from '@/lib/i18n/server';
import ProductGallery from '@/components/product/ProductGallery';
import BuyBox from '@/components/product/BuyBox';
import Benefits from '@/components/product/Benefits';
import ProductTabs from '@/components/product/ProductTabs';
import ProductCard from '@/components/shop/ProductCard';
import Stars from '@/components/ui/Stars';
import { Ornament, SectionTitle } from '@/components/ui/Ornament';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { lp, price } = getI18n();
  const raw = await getProductBySlug(params.slug);
  if (!raw) return { title: '404' };
  const p = lp(raw);
  return {
    title: `${p.name}${p.size ? ` (${p.size})` : ''}`,
    description: p.price > 0 ? `${p.shortDescription} ${price(p.price)}` : p.shortDescription,
    alternates: { canonical: `/produit/${p.slug}`, languages: { 'fr-MA': `/produit/${p.slug}?lang=fr`, 'ar-MA': `/produit/${p.slug}?lang=ar`, en: `/produit/${p.slug}?lang=en` } },
    openGraph: { title: p.name, description: p.shortDescription, images: p.images },
  };
}

export default async function ProductPage({ params }) {
  const { t, locale, lp, price } = getI18n();
  const raw = await getProductBySlug(params.slug);
  if (!raw || raw.active === false) notFound();
  const p = lp(raw);
  const c = CATEGORIES.find((x) => x.slug === p.category);
  const cat = c && { ...c, ...(CATEGORY_I18N[c.slug]?.[locale] || {}) };
  const related = (await getProducts({ category: p.category })).filter((x) => x.slug !== p.slug).slice(0, 4).map(lp);
  const reviews = (await getReviews({ product: p.slug, status: 'approved' })).map(({ orderRef, ...r }) => r);
  const gallery = p.images?.length ? p.images : ['/images/emblem-square.jpg'];

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, alternateName: raw.nameAr, description: p.description,
    image: (p.images || []).map((i) => SITE.url + i), sku: p.slug, brand: { '@type': 'Brand', name: 'NADIA TIFAWT' },
    ...(p.reviewsCount ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewsCount } } : {}),
    ...(p.price > 0 ? { offers: { '@type': 'Offer', priceCurrency: 'MAD', price: p.price, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${SITE.url}/produit/${p.slug}` } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container py-8">
        <nav aria-label={t('crumbs.aria')} className="text-[11px] uppercase tracking-[0.22em] text-cream/50">
          <Link href="/" className="hover:text-gold-300">{t('crumbs.home')}</Link><span className="mx-2 text-gold-500">/</span>
          <Link href={`/boutique?categorie=${p.category}`} className="hover:text-gold-300">{cat?.name}</Link><span className="mx-2 text-gold-500">/</span>
          <span className="text-cream/80">{p.name}</span>
        </nav>
      </div>

      <section className="container grid gap-12 pb-16 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={gallery} name={p.name} />

        <div>
          <p className="eyebrow">{cat?.name}</p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-cream sm:text-5xl">{p.name}</h1>
          {locale !== 'ar' && raw.nameAr && <p dir="rtl" lang="ar" className="mt-2 font-arabic text-2xl text-gold-300/80">{raw.nameAr}</p>}
          <div className="mt-4 flex items-center gap-3 text-sm text-cream/60">
            {p.reviewsCount ? <><Stars value={p.rating} /> <span>{t('product.reviewsLine', { r: p.rating, n: p.reviewsCount })}</span></> : <span className="text-gold-300/80">{t('product.firstReview')}</span>}
          </div>
          <div className="mt-6 flex items-baseline gap-4">
            {p.price > 0
              ? <span className="text-gold-metal font-serif text-5xl font-semibold">{price(p.price)}</span>
              : <span className="text-gold-metal font-serif text-3xl font-semibold sm:text-4xl">{t('product.priceSoon')}</span>}
            {p.price > 0 && p.compareAtPrice && <span className="text-lg text-cream/40 line-through">{price(p.compareAtPrice)}</span>}
            {p.price > 0 && p.compareAtPrice && <span className="rounded-full bg-terracotta px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">{t('product.offer')}</span>}
          </div>
          <p className="mt-1 text-sm text-cream/50">{p.size}</p>
          <p className="mt-6 text-[15px] leading-relaxed text-cream/75">{p.shortDescription}</p>
          <Ornament className="my-8 !justify-start" symbol />
          <BuyBox product={p} />
          <div className="mt-8"><Benefits category={p.category} /></div>
        </div>
      </section>

      <section className="container pb-16"><ProductTabs product={p} reviews={reviews} /></section>

      {related.length > 0 && (
        <section className="border-t border-gold-500/10 bg-forest-950/40 py-20">
          <div className="container">
            <SectionTitle eyebrow={t('product.related')} title={t('product.relatedTitle')} />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((r, i) => <ProductCard key={r.slug} product={r} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
