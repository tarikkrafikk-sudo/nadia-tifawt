'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import Stars from '@/components/ui/Stars';


export default function ProductCard({ product, index = 0, image }) {
  const { add } = useCart();
  const { t, price, locale } = useI18n();
  const out = product.stock <= 0;
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl glass transition-all duration-500 hover:-translate-y-1 hover:border-gold-400 hover:shadow-gold"
    >
      <Link href={`/produit/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden" aria-label={product.name}>
        <Image src={image || product.images?.[0] || '/images/emblem-square.jpg'} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          {product.bestseller && <span className="rounded-full bg-terracotta px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cream">{t('card.bestseller')}</span>}
          {discount > 0 && <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-forest-900">-{discount}%</span>}
          {out && <span className="rounded-full bg-forest-950/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cream/80">{t('card.soldout')}</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="truncate text-[9px] uppercase tracking-[0.2em] text-gold-500 sm:text-[10px] sm:tracking-[0.25em]">{t(`card.cat.${product.category}`)}</span>
          {locale !== 'ar' && <span dir="rtl" lang="ar" className="hidden font-arabic text-sm text-cream/40 sm:inline">{product.nameAr}</span>}
        </div>
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-serif text-[17px] leading-snug text-cream transition group-hover:text-gold-300 sm:text-[22px]">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-cream/50">
          {product.reviewsCount ? <><Stars value={product.rating} size={12} /> <span>({product.reviewsCount})</span></> : <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400/80">{t('card.new')}</span>}
          <span className="ms-auto hidden whitespace-nowrap sm:inline">{product.size}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 sm:pt-3">
          <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="whitespace-nowrap font-serif text-xl font-semibold text-gold-300 sm:text-2xl">{price(product.price)}</span>
            {product.compareAtPrice && <span className="whitespace-nowrap text-[11px] text-cream/40 line-through sm:text-xs">{price(product.compareAtPrice)}</span>}
          </div>
          <button disabled={out} onClick={() => add(product, 1)} aria-label={t('card.add', { p: product.name })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-500/50 text-gold-300 transition-all duration-300 hover:bg-gold-400 hover:text-forest-900 disabled:cursor-not-allowed disabled:opacity-30">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
