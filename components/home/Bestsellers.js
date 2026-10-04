import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { SectionTitle } from '@/components/ui/Ornament';
import Watermark from '@/components/ui/Watermark';
import { getI18n } from '@/lib/i18n/server';
import { JAR_ART } from '@/lib/catalog';

export default function Bestsellers({ products }) {
  const { t } = getI18n();
  return (
    <section id="best" className="relative overflow-hidden bg-forest-950/40 py-24">
      <Watermark className="-end-32 top-0 h-[520px] w-[520px]" />
      <div className="container relative">
        <SectionTitle eyebrow={t('best.eyebrow')} title={t('best.title')} subtitle={t('best.subtitle')} />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} image={JAR_ART[p.slug]} />)}
        </div>
        <div className="mt-12 text-center"><Link href="/boutique" className="btn-outline">{t('best.all')}</Link></div>
      </div>
    </section>
  );
}
