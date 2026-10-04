import { Suspense } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ProductCard from '@/components/shop/ProductCard';
import ShopToolbar from '@/components/shop/ShopToolbar';
import Yaz from '@/components/ui/Yaz';
import { getProducts } from '@/lib/data';
import { CATEGORIES, CATEGORY_I18N } from '@/lib/catalog';
import { getI18n } from '@/lib/i18n/server';

const findCat = (slug, locale) => {
  const c = CATEGORIES.find((x) => x.slug === slug);
  return c && { ...c, ...(CATEGORY_I18N[c.slug]?.[locale] || {}) };
};

export async function generateMetadata({ searchParams }) {
  const { t, locale } = getI18n();
  const c = findCat(searchParams.categorie, locale);
  return {
    title: c ? (locale === 'ar' ? c.name : `${c.name} — ${c.nameAr}`) : t('shop.metaTitle'),
    description: c ? `${c.name} : ${c.tagline}.` : t('shop.metaDesc'),
    alternates: { canonical: c ? `/boutique?categorie=${c.slug}` : '/boutique' },
  };
}

export default async function ShopPage({ searchParams }) {
  const { t, locale, lp } = getI18n();
  const cat = findCat(searchParams.categorie, locale);
  const products = (await getProducts({ category: cat?.slug, sort: searchParams.tri, q: searchParams.q, maxPrice: searchParams.prix })).map(lp);

  return (
    <>
      <PageHeader title={cat ? cat.name : t('shop.title')} eyebrow={cat ? (locale === 'ar' ? null : cat.nameAr) : t('shop.all')}
        crumbs={[[t('crumbs.shop'), cat ? '/boutique' : null], ...(cat ? [[cat.name]] : [])]}>
        <p className="mx-auto mt-5 max-w-xl text-sm text-cream/65">{cat ? cat.tagline : t('shop.tagline')}</p>
      </PageHeader>
      <section className="container py-14">
        <Suspense><ShopToolbar total={products.length} /></Suspense>
        {products.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Yaz className="h-12 w-12 text-gold-500/40" strokeWidth={5} />
            <p className="font-serif text-2xl">{t('shop.empty')}</p>
          </div>
        )}
      </section>
    </>
  );
}
