'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import PageHeaderClient from '@/components/ui/PageHeaderClient';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/catalog';
import Yaz from '@/components/ui/Yaz';

export default function CartPage() {
  const { items, subtotal, update, remove, ready } = useCart();
  const { t, price, lp } = useI18n();

  return (
    <>
      <PageHeaderClient title={t('cart.title')} />
      <section className="container py-14">
        {!ready ? null : items.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <Yaz className="h-14 w-14 text-gold-500/40" strokeWidth={5} />
            <p className="font-serif text-3xl">{t('cart.empty')}</p>
            <Link href="/boutique" className="btn-gold">{t('cart.discover')}</Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <ul className="divide-y divide-gold-500/10 rounded-2xl border border-gold-500/15">
              {items.map(lp).map((i) => (
                <li key={i.slug} className="flex gap-3 p-3 sm:gap-5 sm:p-5">
                  <div className="relative h-24 w-20 shrink-0 sm:h-28 sm:w-24 overflow-hidden rounded-xl border border-gold-500/20">
                    <Image src={i.image || '/images/emblem-square.jpg'} alt={i.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <Link href={`/produit/${i.slug}`} className="font-serif text-xl text-cream hover:text-gold-300">{i.name}</Link>
                      <p className="text-xs text-cream/50">{i.size} · {price(i.price)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:gap-6">
                      <div className="flex items-center rounded-full border border-gold-500/30">
                        <button className="p-2 text-gold-300" onClick={() => update(i.slug, i.quantity - 1)} aria-label={t('product.decrease')}><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-8 text-center">{i.quantity}</span>
                        <button className="p-2 text-gold-300" onClick={() => update(i.slug, i.quantity + 1)} aria-label={t('product.increase')}><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <span className="whitespace-nowrap text-end font-semibold text-gold-300 sm:w-24">{price(i.price * i.quantity)}</span>
                      <button onClick={() => remove(i.slug)} aria-label={t('cart.remove')} className="text-cream/40 hover:text-terracotta-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="card-lux h-fit space-y-4 p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl">{t('cart.summary')}</h2>
              <div className="flex justify-between text-sm"><span className="text-cream/65">{t('cart.subtotal')}</span><span>{price(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-cream/65">{t('cart.shipping')}</span><span className="text-gold-300">{subtotal >= FREE_SHIPPING_THRESHOLD ? t('cart.free') : t('cart.nextStep')}</span></div>
              <div className="gold-line" />
              <div className="flex justify-between"><span>{t('cart.total')}</span><span className="font-serif text-3xl text-gold-300">{price(subtotal)}</span></div>
              <Link href="/checkout" className="btn-gold w-full">{t('cart.proceed')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
              <p className="text-center text-[11px] text-cream/50">{t('cart.methods')}</p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
