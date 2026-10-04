'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ExternalLink, MessageSquareText, ShieldCheck } from 'lucide-react';

const NAV = [
  ['/admin', 'Tableau de bord', LayoutDashboard],
  ['/admin/commandes', 'Commandes', ShoppingCart],
  ['/admin/produits', 'Produits & prix', Package],
  ['/admin/avis', 'Avis clients', MessageSquareText],
  ['/admin/parametres', 'Légal & ONSSA', ShieldCheck],
];

export default function AdminShell({ children }) {
  const path = usePathname();
  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/admin/login'; };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="amazigh-pattern sticky top-0 z-30 flex flex-col border-b border-gold-500/15 bg-forest-950/70 backdrop-blur-md lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 p-5">
          <span className="block h-11 w-11 rounded-full bg-gold-metal p-[2px]"><Image src="/images/emblem.png" alt="" width={88} height={88} className="rounded-full" /></span>
          <div><p className="text-gold-metal font-serif text-xl font-semibold tracking-widest">NADIA</p><p className="text-[9px] tracking-[0.4em] text-gold-400">ADMIN</p></div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {NAV.map(([href, label, I]) => {
            const active = href === '/admin' ? path === href : path.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? 'bg-gold-500/15 text-gold-300' : 'text-cream/65 hover:bg-white/[0.07] hover:text-cream'}`}>
                <I className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="absolute end-4 top-6 grid h-10 w-10 place-items-center rounded-lg text-cream/55 hover:text-cream lg:hidden" aria-label="Déconnexion"><LogOut className="h-4 w-4" /></button>
        <div className="mt-auto hidden space-y-1 p-3 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream/55 hover:text-cream"><ExternalLink className="h-4 w-4" /> Voir le site</Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream/55 hover:text-terracotta-600"><LogOut className="h-4 w-4" /> Déconnexion</button>
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
