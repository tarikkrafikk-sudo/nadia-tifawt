'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Check, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { waLink } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export default function BuyBox({ product }) {
  const { add } = useCart();
  const { t, price } = useI18n();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;
  const mainBtn = useRef(null);
  const [showBar, setShowBar] = useState(false);
  const addNow = () => { add(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); };

  // Barre « Ajouter au panier » collante sur mobile quand le bouton principal n'est plus visible
  useEffect(() => {
    const el = mainBtn.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => { io.disconnect(); document.body.classList.remove('has-sticky-bar'); };
  }, []);
  const noPrice = !(product.price > 0);
  useEffect(() => { document.body.classList.toggle('has-sticky-bar', showBar && !out && !noPrice); }, [showBar, out, noPrice]);

  // Prix pas encore défini (0) : pas d'ajout au panier, demande du prix sur WhatsApp
  if (noPrice)
    return (
      <div className="space-y-4">
        <a href={waLink(t('wa.askPrice', { p: product.name }))} target="_blank" rel="noopener" className="btn-gold w-full py-4">
          <MessageCircle className="h-4 w-4" /> {t('product.askPrice')}
        </a>
        <p className="text-xs text-cream/55">{t('product.priceNote')}</p>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center rounded-full border border-gold-500/40">
          <button className="grid h-12 w-12 place-items-center text-gold-300 disabled:opacity-30" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} aria-label={t('product.decrease')}><Minus className="h-4 w-4" /></button>
          <span className="w-10 text-center text-lg font-semibold" aria-live="polite">{qty}</span>
          <button className="grid h-12 w-12 place-items-center text-gold-300 disabled:opacity-30" disabled={qty >= Math.min(20, product.stock)} onClick={() => setQty((q) => q + 1)} aria-label={t('product.increase')}><Plus className="h-4 w-4" /></button>
        </div>
        <button ref={mainBtn} disabled={out} className="btn-gold min-w-[190px] flex-1 py-4" onClick={addNow}>
          {added ? <><Check className="h-4 w-4" /> {t('product.added')}</> : <><ShoppingBag className="h-4 w-4" /> {out ? t('product.soldout') : t('product.add')}</>}
        </button>
      </div>
      <a href={waLink(t('wa.orderProduct', { p: product.name, s: product.size, q: qty, t: price(product.price * qty) }))}
        target="_blank" rel="noopener" className="btn-outline w-full py-4">{t('product.orderWa')}</a>
      <p className={`text-xs ${product.stock > 0 && product.stock <= 5 ? 'text-terracotta-600' : 'text-cream/55'}`}>
        {out ? t('product.outMsg') : product.stock <= 5 ? t('product.lowMsg', { n: product.stock }) : t('product.inStock')}
      </p>
      <AnimatePresence>
        {showBar && !out && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/30 bg-forest-950/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gold-500/30">
                <Image src={product.images?.[0] || '/images/emblem-square.jpg'} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-cream">{product.name}</p>
                <p className="font-serif text-lg leading-none text-gold-300">{price(product.price * qty)}</p>
              </div>
              <button onClick={addNow} className="btn-gold min-h-[44px] shrink-0 px-5 py-2.5">
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}<span className="hidden min-[400px]:inline">{added ? t('product.added') : t('product.add')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
