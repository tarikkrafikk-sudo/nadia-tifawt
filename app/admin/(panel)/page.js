import Link from 'next/link';
import { TrendingUp, ShoppingCart, Clock, Package, AlertTriangle, MessageSquareText } from 'lucide-react';
import { getStats, getOrders } from '@/lib/data';
import { formatMAD } from '@/lib/utils';
import { STATUS } from '@/components/admin/status';
import { usingDefaultPassword } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [s, orders] = await Promise.all([getStats(), getOrders()]);
  const cards = [
    ['Chiffre d’affaires', formatMAD(s.revenue), TrendingUp],
    ['Commandes', s.ordersCount, ShoppingCart],
    ['À traiter', s.pending, Clock],
    ['Avis à modérer', s.pendingReviews, MessageSquareText, '/admin/avis'],
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Bienvenue</p><h1 className="font-serif text-4xl">Tableau de bord</h1></div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${s.mode === 'mongodb' ? 'bg-forest-700 text-gold-300' : 'bg-terracotta text-cream'}`}>
          {s.mode === 'mongodb' ? 'MongoDB connecté' : 'Mode démo (mémoire)'}
        </span>
      </header>

      {usingDefaultPassword() && (
        <p className="rounded-xl border border-terracotta-600/60 bg-terracotta/20 p-4 text-sm">
          Vous utilisez le mot de passe par défaut. Avant la mise en ligne, définissez <code className="text-gold-300">ADMIN_PASSWORD=...</code> dans le fichier <code className="text-gold-300">.env.local</code> puis redémarrez le site.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v, I, href]) => (
          <Link key={l} href={href || '#'} className={`card-lux block p-5 ${href ? 'transition hover:border-gold-400' : 'pointer-events-none'}`}>
            <div className="flex items-center justify-between text-cream/55"><span className="text-xs uppercase tracking-[0.2em]">{l}</span><I className="h-4 w-4 text-gold-400" /></div>
            <p className="mt-3 font-serif text-4xl text-gold-300">{v}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="card-lux overflow-hidden">
          <div className="flex items-center justify-between border-b border-gold-500/10 p-5"><h2 className="font-serif text-2xl">Dernières commandes</h2><Link href="/admin/commandes" className="text-xs uppercase tracking-[0.2em] text-gold-400 hover:text-gold-300">Tout voir</Link></div>
          {orders.length === 0 ? <p className="p-8 text-center text-sm text-cream/50">Aucune commande pour le moment. Passez une commande test depuis le site.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gold-500/10">
                  {orders.slice(0, 8).map((o) => (
                    <tr key={o._id}>
                      <td className="px-5 py-3 font-mono text-xs text-gold-300">{o.reference}</td>
                      <td className="px-5 py-3">{o.customer.fullName}<span className="block text-xs text-cream/45">{o.customer.city}</span></td>
                      <td className="px-5 py-3">{formatMAD(o.total)}</td>
                      <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card-lux p-5">
          <h2 className="flex items-center gap-2 font-serif text-2xl"><AlertTriangle className="h-5 w-5 text-terracotta-600" /> Stock faible</h2>
          <ul className="mt-4 divide-y divide-gold-500/10">
            {s.lowStock.length === 0 && <li className="py-3 text-sm text-cream/50">Tous les stocks sont bons.</li>}
            {s.lowStock.map((p) => (
              <li key={p._id} className="flex justify-between py-3 text-sm"><span>{p.name}</span><b className={p.stock === 0 ? 'text-terracotta-600' : 'text-gold-300'}>{p.stock}</b></li>
            ))}
          </ul>
          <Link href="/admin/produits" className="btn-outline mt-5 w-full py-2.5">Gérer le stock</Link>
        </section>
      </div>
    </div>
  );
}
