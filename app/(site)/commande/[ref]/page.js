import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getOrderByRef, getProducts } from '@/lib/data';
import { waLink } from '@/lib/utils';
import { getI18n } from '@/lib/i18n/server';
import { Ornament } from '@/components/ui/Ornament';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { t } = getI18n();
  return { title: t('order.title'), robots: { index: false } };
}

export default async function OrderPage({ params }) {
  const { t, price, lp } = getI18n();
  const o = await getOrderByRef(params.ref);
  if (!o) notFound();
  const products = await getProducts({ includeInactive: true });
  const nameOf = (i) => { const p = products.find((x) => x.slug === i.slug); return p ? lp(p).name : i.name; };

  return (
    <section className="container max-w-3xl py-20 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-gold-400" strokeWidth={1.2} />
      <p className="eyebrow mt-6">{t('order.thanks', { name: o.customer.fullName.split(' ')[0] })}</p>
      <h1 className="text-gold-metal mt-3 font-serif text-5xl">{t('order.title')}</h1>
      <Ornament className="my-6" symbol />
      <p className="text-cream/70">
        {t('order.ref')} <b dir="ltr" className="text-gold-300">{o.reference}</b>.{' '}
        {t('order.call', { phone: o.customer.phone, city: o.customer.city })}
      </p>

      {o.paymentMethod === 'wafacash' && (
        <div className="card-lux mt-8 p-6 text-start text-sm text-cream/75">
          <p className="font-serif text-xl text-cream">{t('order.wafaTitle')}</p>
          <p className="mt-2">{t('order.wafaText', { ref: o.reference, t: price(o.total) })}</p>
        </div>
      )}

      <div className="card-lux mt-8 p-6 text-start">
        <ul className="divide-y divide-gold-500/10">
          {o.items.map((i) => (
            <li key={i.slug} className="flex justify-between py-3 text-sm"><span>{nameOf(i)} × {i.quantity}</span><span className="text-gold-300">{price(i.price * i.quantity)}</span></li>
          ))}
        </ul>
        <div className="gold-line my-4" />
        <div className="flex justify-between text-sm text-cream/65"><span>{t('order.shipping')}</span><span>{o.shippingFee ? price(o.shippingFee) : t('cart.free')}</span></div>
        <div className="mt-2 flex justify-between text-sm text-cream/65"><span>{t('order.payment')}</span><span>{t(`checkout.methods.${o.paymentMethod}`)[0]}</span></div>
        <div className="mt-4 flex items-baseline justify-between"><span>{t('order.total')}</span><span className="font-serif text-3xl text-gold-300">{price(o.total)}</span></div>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <a href={waLink(t('wa.confirm', { ref: o.reference, t: price(o.total) }))} target="_blank" rel="noopener" className="btn-gold">{t('order.confirmWa')}</a>
        <Link href="/boutique" className="btn-outline">{t('order.continue')}</Link>
      </div>
    </section>
  );
}
