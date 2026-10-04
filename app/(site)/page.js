import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Categories from '@/components/home/Categories';
import Bestsellers from '@/components/home/Bestsellers';
import Story from '@/components/home/Story';
import Testimonials from '@/components/home/Testimonials';
import InstagramFeed from '@/components/home/InstagramFeed';
import { getProducts, getReviews } from '@/lib/data';
import { getI18n } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

const PICK = ['miel-euphorbe-atlas', 'amlou-traditionnel-argan', 'creme-visage-miel-argan', 'miel-thym-montagne'];

export default async function HomePage() {
  const { lp } = getI18n();
  const all = (await getProducts()).map(lp);
  const picked = PICK.map((s) => all.find((p) => p.slug === s)).filter(Boolean);
  const best = picked.length >= 4 ? picked : all.filter((p) => p.bestseller).slice(0, 4);
  const approved = await getReviews({ status: 'approved' });
  const featured = approved.filter((r) => r.featured);
  // avis mis en avant d'abord, puis les autres avis publiés (4★ et +)
  const testimonials = [...featured, ...approved.filter((r) => !r.featured && r.rating >= 4)].slice(0, 10)
    .map(({ orderRef, ...r }) => ({ ...r, productName: all.find((p) => p.slug === r.product)?.name || r.productName }));

  return (
    <>
      <Hero />
      <Marquee />
      <Bestsellers products={best} />
      <Categories />
      <Story />
      <Testimonials reviews={testimonials} products={all.map(({ slug, name }) => ({ slug, name }))} />
      <InstagramFeed />
    </>
  );
}
