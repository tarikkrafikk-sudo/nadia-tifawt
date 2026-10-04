'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Banknote, Smartphone, CreditCard, Landmark, Lock, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD } from '@/lib/catalog';

const ICONS = { cod: Banknote, wafacash: Landmark, mopay: Smartphone, cmi: CreditCard };
const CITIES_AR = ['أكادير', 'إنزكان', 'أيت ملول', 'الدشيرة', 'الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'مكناس', 'القنيطرة', 'تطوان', 'تارودانت'];
const CITIES = ['Agadir', 'Inezgane', 'Aït Melloul', 'Dcheira', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Meknès', 'Kénitra', 'Tétouan', 'Taroudant', 'Autre'];

function zoneFor(city) {
  const c = (city || '').toLowerCase();
  if (['agadir', 'inezgane', 'melloul', 'dcheira', 'أكادير', 'اكادير', 'إنزكان', 'انزكان', 'ملول', 'الدشيرة'].some((x) => c.includes(x))) return 'agadir';
  return 'maroc';
}

export default function CheckoutForm({ methods }) {
  const router = useRouter();
  const { items, subtotal, clear, ready } = useCart();
  const { t, price, lp, locale } = useI18n();
  const [f, setF] = useState({ fullName: '', phone: '', email: '', city: '', address: '', notes: '' });
  const [payment, setPayment] = useState('cod');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const zone = SHIPPING_ZONES.find((z) => z.id === zoneFor(f.city));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : zone.fee;
  const total = subtotal + shipping;
  const on = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: f, shippingZone: zone.id, paymentMethod: payment, locale, items: items.map(({ slug, quantity }) => ({ slug, quantity })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('checkout.error'));
      clear();
      if (data.payment?.redirectUrl) return (window.location.href = data.payment.redirectUrl);
      if (data.payment?.action) {
        // CMI : soumission automatique du formulaire 3D Secure
        const form = document.createElement('form');
        form.method = 'POST'; form.action = data.payment.action;
        Object.entries(data.payment.fields).forEach(([k, v]) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; form.appendChild(i); });
        document.body.appendChild(form); return form.submit();
      }
      router.push(`/commande/${data.order.reference}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (ready && !items.length && !loading)
    return (
      <div className="container flex flex-col items-center gap-5 py-24 text-center">
        <p className="font-serif text-3xl">{t('cart.empty')}</p>
        <Link href="/boutique" className="btn-gold">{t('checkout.back')}</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="container grid gap-10 py-14 lg:grid-cols-[1fr_420px]">
      <div className="space-y-10">
        {/* 1. Livraison */}
        <fieldset className="card-lux p-6 sm:p-8">
          <legend className="sr-only">Informations de livraison</legend>
          <h2 className="flex items-center gap-3 font-serif text-3xl"><span className="grid h-9 w-9 place-items-center rounded-full border border-gold-500/50 text-base text-gold-300">1</span> {t('checkout.delivery')}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label-lux" htmlFor="fullName">{t('checkout.fullName')}</label><input id="fullName" required autoComplete="name" value={f.fullName} onChange={on('fullName')} className="input-lux" placeholder={t('checkout.ph.name')} /></div>
            <div><label className="label-lux" htmlFor="phone">{t('checkout.phone')}</label><input id="phone" required type="tel" inputMode="tel" autoComplete="tel" pattern="^(\+212|0)[5-7][0-9 .\-]{8,12}$" value={f.phone} onChange={on('phone')} dir="ltr" className="input-lux rtl:text-right" placeholder="06 XX XX XX XX" /></div>
            <div><label className="label-lux" htmlFor="email">{t('checkout.email')}</label><input id="email" type="email" autoComplete="email" value={f.email} onChange={on('email')} className="input-lux" placeholder={t('checkout.ph.email')} /></div>
            <div>
              <label className="label-lux" htmlFor="city">{t('checkout.city')}</label>
              <input id="city" required list="cities" autoComplete="address-level2" value={f.city} onChange={on('city')} className="input-lux" placeholder={t('checkout.ph.city')} />
              <datalist id="cities">{(locale === 'ar' ? CITIES_AR : CITIES).map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div><label className="label-lux" htmlFor="address">{t('checkout.address')}</label><input id="address" required autoComplete="street-address" value={f.address} onChange={on('address')} className="input-lux" placeholder={t('checkout.ph.address')} /></div>
            <div className="sm:col-span-2"><label className="label-lux" htmlFor="notes">{t('checkout.notes')}</label><textarea id="notes" rows={2} value={f.notes} onChange={on('notes')} className="input-lux" placeholder={t('checkout.ph.notes')} /></div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {SHIPPING_ZONES.map((z) => (
              <div key={z.id} className={`rounded-xl border p-4 text-sm transition ${zone.id === z.id ? 'border-gold-400 bg-gold-500/10' : 'border-gold-500/15 opacity-60'}`}>
                <p className="font-semibold text-cream">{t(`checkout.zones.${z.id}`)}</p>
                <p className="mt-1 text-xs text-cream/60">{t(`checkout.delays.${z.id}`)} · {z.fee === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? t('cart.free') : price(z.fee)}</p>
              </div>
            ))}
          </div>
        </fieldset>

        {/* 2. Paiement */}
        <fieldset className="card-lux p-6 sm:p-8">
          <legend className="sr-only">Mode de paiement</legend>
          <h2 className="flex items-center gap-3 font-serif text-3xl"><span className="grid h-9 w-9 place-items-center rounded-full border border-gold-500/50 text-base text-gold-300">2</span> {t('checkout.payment')}</h2>
          <div className="mt-6 space-y-3">
            {methods.map((m) => {
              const I = ICONS[m.id];
              return (
                <label key={m.id} className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                  !m.enabled ? 'cursor-not-allowed opacity-45' : payment === m.id ? 'border-gold-400 bg-gold-500/10 shadow-gold' : 'border-gold-500/20 hover:border-gold-500/50'}`}>
                  <input type="radio" name="payment" value={m.id} disabled={!m.enabled} checked={payment === m.id} onChange={() => setPayment(m.id)} className="mt-1 accent-[#D4AF37]" />
                  <I className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold text-cream">{t(`checkout.methods.${m.id}`)[0]}
                      {!m.enabled && <span className="rounded-full bg-forest-950 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-cream/60">{t('checkout.soon')}</span>}
                      {m.id === 'cod' && <span className="rounded-full bg-terracotta px-2 py-0.5 text-[9px] uppercase tracking-[0.18em]">{t('checkout.recommended')}</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-cream/55">{t(`checkout.methods.${m.id}`)[1]}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Récapitulatif */}
      <aside className="card-lux h-fit p-6 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl">{t('checkout.yourOrder')}</h2>
        <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
          {items.map(lp).map((i) => (
            <li key={i.slug} className="flex items-center gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-gold-500/20">
                <Image src={i.image || '/images/emblem-square.jpg'} alt="" fill sizes="56px" className="object-cover" />
                <span className="absolute end-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-[10px] font-bold text-forest-900">{i.quantity}</span>
              </div>
              <span className="flex-1 text-sm leading-tight">{i.name}<span className="block text-xs text-cream/45">{i.size}</span></span>
              <span className="text-sm text-gold-300">{price(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="gold-line my-5" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-cream/65">{t('cart.subtotal')}</span><span>{price(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-cream/65">{t('cart.shipping')} ({t(`checkout.delays.${zone.id}`)})</span><span className={shipping ? '' : 'text-gold-300'}>{shipping ? price(shipping) : t('cart.free')}</span></div>
        </div>
        <div className="gold-line my-5" />
        <div className="flex items-baseline justify-between"><span>{t('cart.total')}</span><span className="text-gold-metal font-serif text-4xl font-semibold">{price(total)}</span></div>
        {error && <p role="alert" className="mt-4 rounded-lg border border-terracotta-600/60 bg-terracotta/20 p-3 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !items.length} className="btn-gold mt-6 w-full py-4">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} {t('checkout.confirm')}
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-cream/45">{t('checkout.consent')}</p>
      </aside>
    </form>
  );
}
