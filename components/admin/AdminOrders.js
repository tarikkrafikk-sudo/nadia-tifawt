'use client';
import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, Loader2, Phone, RefreshCw } from 'lucide-react';
import { formatMAD } from '@/lib/utils';
import { STATUS, PAY_LABEL } from './status';

const ZONE = { oujda: 'Oujda (ancien)', agadir: 'Agadir', maroc: 'Maroc' };
const wa = (phone) => `https://wa.me/${phone.replace(/[\s.-]/g, '').replace(/^0/, '212').replace(/^\+/, '')}`;

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(null);

  const load = () => { setOrders(null); fetch('/api/admin/orders').then((r) => r.json()).then((d) => setOrders(d.orders)); };
  useEffect(load, []);

  const patch = async (id, data) => {
    setOrders((l) => l.map((o) => (o._id === id ? { ...o, ...data } : o)));
    await fetch(`/api/admin/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  };

  const shown = (orders || []).filter((o) => !filter || o.status === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Ventes</p><h1 className="font-serif text-4xl">Commandes</h1></div>
        <button onClick={load} className="btn-outline py-2.5"><RefreshCw className="h-4 w-4" /> Actualiser</button>
      </header>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {[['', 'Toutes'], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition ${filter === k ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-gold-500/20 text-cream/60 hover:text-cream'}`}>
            {l} {orders && <span className="opacity-60">({k ? orders.filter((o) => o.status === k).length : orders.length})</span>}
          </button>
        ))}
      </div>

      {/* Mobile : cartes */}
      <ul className="space-y-3 md:hidden">
        {orders && shown.length === 0 && <li className="card-lux p-10 text-center text-sm text-cream/50">Aucune commande.</li>}
        {shown.map((o) => (
          <li key={o._id} className="card-lux p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-gold-300">{o.reference}</p>
                <p className="mt-1 font-medium">{o.customer.fullName}</p>
                <p className="text-xs text-cream/45">{o.customer.city} · {new Date(o.createdAt).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })} · {(o.locale || 'fr').toUpperCase()}</p>
              </div>
              <p className="whitespace-nowrap font-serif text-2xl text-gold-300">{formatMAD(o.total)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select value={o.status} onChange={(e) => patch(o._id, { status: e.target.value })} className={`rounded-full border-0 px-3 py-2 text-xs font-semibold uppercase ${STATUS[o.status].cls}`}>
                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k} className="bg-forest-900 text-cream">{v.label}</option>)}
              </select>
              <select value={o.paymentStatus} onChange={(e) => patch(o._id, { paymentStatus: e.target.value })} className="rounded-full border border-gold-500/20 bg-forest-950 px-3 py-2 text-xs">
                <option value="pending">{PAY_LABEL[o.paymentMethod]} · en attente</option><option value="paid">Payé</option><option value="failed">Échoué</option><option value="refunded">Remboursé</option>
              </select>
            </div>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer py-1 text-xs uppercase tracking-[0.15em] text-gold-400">Détails</summary>
              <p className="mt-2 text-cream/70">{o.customer.address}, {o.customer.city} · {o.customer.phone}</p>
              {o.customer.notes && <p className="italic text-cream/50">« {o.customer.notes} »</p>}
              <ul className="mt-2 divide-y divide-gold-500/10">{o.items.map((i) => <li key={i.slug} className="flex justify-between py-1.5"><span>{i.name} × {i.quantity}</span><span>{formatMAD(i.price * i.quantity)}</span></li>)}</ul>
            </details>
            <a href={wa(o.customer.phone)} target="_blank" rel="noopener" className="btn-outline mt-3 w-full py-2 text-[11px]"><Phone className="h-3.5 w-3.5" /> WhatsApp client</a>
          </li>
        ))}
      </ul>

      <div className="card-lux hidden overflow-x-auto md:block">
        {!orders ? <div className="grid place-items-center p-16"><Loader2 className="h-6 w-6 animate-spin text-gold-400" /></div>
          : shown.length === 0 ? <p className="p-12 text-center text-sm text-cream/50">Aucune commande.</p> : (
          <table className="w-full min-w-[860px] text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.2em] text-cream/45">
              <tr className="border-b border-gold-500/10"><th className="p-4">Réf.</th><th className="p-4">Date</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Paiement</th><th className="p-4">Statut</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {shown.map((o) => (
                <Fragment key={o._id}>
                  <tr className="hover:bg-forest-800/40">
                    <td className="p-4 font-mono text-xs text-gold-300">{o.reference}</td>
                    <td className="p-4 text-cream/60">{new Date(o.createdAt).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td className="p-4">{o.customer.fullName}<span className="block text-xs text-cream/45">{o.customer.city} · {ZONE[o.shippingZone]} · {(o.locale || 'fr').toUpperCase()}</span></td>
                    <td className="p-4 font-semibold">{formatMAD(o.total)}</td>
                    <td className="p-4">
                      <span className="text-xs">{PAY_LABEL[o.paymentMethod]}</span>
                      <select value={o.paymentStatus} onChange={(e) => patch(o._id, { paymentStatus: e.target.value })} className="mt-1 block rounded-md border border-gold-500/20 bg-forest-950 px-2 py-1 text-xs">
                        <option value="pending">En attente</option><option value="paid">Payé</option><option value="failed">Échoué</option><option value="refunded">Remboursé</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select value={o.status} onChange={(e) => patch(o._id, { status: e.target.value })}
                        className={`rounded-full border-0 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${STATUS[o.status].cls}`}>
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k} className="bg-forest-900 text-cream">{v.label}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setOpen(open === o._id ? null : o._id)} aria-label="Détails" className="rounded-lg p-2 text-gold-300 hover:bg-gold-500/10">
                        <ChevronDown className={`h-4 w-4 transition ${open === o._id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                  </tr>
                  {open === o._id && (
                    <tr className="bg-forest-950/50">
                      <td colSpan={7} className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-1 text-sm">
                            <p className="eyebrow mb-2">Livraison</p>
                            <p>{o.customer.fullName}</p><p>{o.customer.address}, {o.customer.city}</p>
                            <p>{o.customer.phone} {o.customer.email && `· ${o.customer.email}`}</p>
                            {o.customer.notes && <p className="italic text-cream/60">« {o.customer.notes} »</p>}
                            <a href={wa(o.customer.phone)} target="_blank" rel="noopener" className="btn-outline mt-3 py-2 text-[11px]"><Phone className="h-3.5 w-3.5" /> WhatsApp client</a>
                          </div>
                          <div>
                            <p className="eyebrow mb-2">Articles</p>
                            <ul className="divide-y divide-gold-500/10 text-sm">
                              {o.items.map((i) => <li key={i.slug} className="flex justify-between py-2"><span>{i.name} × {i.quantity}</span><span>{formatMAD(i.price * i.quantity)}</span></li>)}
                              <li className="flex justify-between py-2 text-cream/60"><span>Livraison</span><span>{o.shippingFee ? formatMAD(o.shippingFee) : 'Offerte'}</span></li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
