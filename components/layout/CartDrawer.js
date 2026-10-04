'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/catalog';
import Yaz from '@/components/ui/Yaz';

export default function CartDrawer() {
  const { items, open, setOpen, subtotal, update, remove } = useCart();
  const { t, price, dir, lp } = useI18n();
  const left = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <motion.aside role="dialog" aria-label={t('cart.title')}
            initial={{ x: dir === 'rtl' ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: dir === 'rtl' ? '-100%' : '100%' }} transition={{ type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-0 flex h-full w-full max-w-md flex-col border-s border-gold-500/20 bg-forest-900">
            <div className="flex items-center justify-between border-b border-gold-500/15 px-6 py-5">
              <h2 className="font-serif text-2xl text-cream">{t('cart.title')}</h2>
              <button onClick={() => setOpen(false)} aria-label={t('nav.close')} className="rounded-full p-1 text-gold-300 hover:bg-gold-500/10"><X /></button>
            </div>

            {items.length > 0 && (
              <div className="border-b border-gold-500/10 px-6 py-4">
                <p className="mb-2 text-xs text-cream/70">
                  {left > 0 ? t('cart.freeLeft', { x: price(left) }) : <span className="text-gold-300">{t('cart.freeOk')}</span>}
                </p>
                <div className="h-1 overflow-hidden rounded-full bg-forest-950"><div className="h-full bg-gold-metal transition-all duration-700" style={{ width: `${pct}%` }} /></div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <Yaz className="h-14 w-14 text-gold-500/40" strokeWidth={5} />
                  <p className="font-serif text-2xl text-cream">{t('cart.empty')}</p>
                  <p className="text-sm text-cream/60">{t('cart.emptySub')}</p>
                  <Link href="/boutique" onClick={() => setOpen(false)} className="btn-gold mt-2">{t('cart.discover')}</Link>
                </div>
              ) : (
                <ul className="divide-y divide-gold-500/10">
                  {items.map((it) => { const i = lp(it); return (
                    <li key={i.slug} className="flex gap-4 py-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-gold-500/20">
                        <Image src={i.image || '/images/emblem-square.jpg'} alt={i.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link href={`/produit/${i.slug}`} onClick={() => setOpen(false)} className="font-serif text-lg leading-tight text-cream hover:text-gold-300">{i.name}</Link>
                          <button onClick={() => remove(i.slug)} aria-label={t('cart.remove')} className="text-cream/40 hover:text-terracotta-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <span className="text-xs text-cream/50">{i.size}</span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-gold-500/30">
                            <button className="p-1.5 text-gold-300" onClick={() => update(i.slug, i.quantity - 1)} aria-label={t('product.decrease')}><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-7 text-center text-sm">{i.quantity}</span>
                            <button className="p-1.5 text-gold-300" onClick={() => update(i.slug, i.quantity + 1)} aria-label={t('product.increase')}><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <span className="font-semibold text-gold-300">{price(i.price * i.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ); })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-gold-500/15 bg-forest-950/50 px-6 py-5">
                <div className="flex justify-between text-sm"><span className="text-cream/70">{t('cart.subtotal')}</span><span className="font-serif text-2xl text-gold-300">{price(subtotal)}</span></div>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn-gold w-full"><ShoppingBag className="h-4 w-4" />{t('cart.checkout')}</Link>
                <Link href="/panier" onClick={() => setOpen(false)} className="block text-center text-xs uppercase tracking-[0.2em] text-cream/60 hover:text-gold-300">{t('cart.view')}</Link>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
