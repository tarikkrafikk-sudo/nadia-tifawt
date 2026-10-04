'use client';
import { useEffect, useMemo, useState } from 'react';
import { Check, X, Trash2, Pencil, Sparkles, Plus, Loader2, Star, MessageSquareReply, BadgeCheck, Eraser } from 'lucide-react';
import Stars from '@/components/ui/Stars';
import ImageUploader from './ImageUploader';

const TABS = [['pending', 'En attente'], ['approved', 'Publiés'], ['rejected', 'Refusés'], ['', 'Tous']];
const BADGE = { pending: 'bg-terracotta text-cream', approved: 'bg-forest-600 text-cream', rejected: 'bg-black/40 text-cream/50' };
const LABEL = { pending: 'En attente', approved: 'Publié', rejected: 'Refusé' };

export default function AdminReviews() {
  const [all, setAll] = useState(null);
  const [tab, setTab] = useState('pending');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [products, setProducts] = useState([]);
  const [samples, setSamples] = useState(0);

  const load = () => {
    fetch('/api/admin/reviews').then((r) => r.json()).then((d) => setAll(d.reviews));
    fetch('/api/admin/reviews/samples').then((r) => r.json()).then((d) => setSamples(d.count || 0));
  };
  const clearSamples = async () => {
    if (!window.confirm(`Supprimer les ${samples} avis d’exemple de la démo ?`)) return;
    await fetch('/api/admin/reviews/samples', { method: 'DELETE' });
    load();
  };
  useEffect(() => {
    load();
    fetch('/api/admin/products').then((r) => r.json()).then((d) => setProducts(d.products));
  }, []);

  const patch = async (id, data) => {
    setAll((l) => l.map((r) => (r._id === id ? { ...r, ...data } : r)));
    await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  };
  const del = async (r) => {
    if (!window.confirm(`Supprimer l’avis de ${r.name} ?`)) return;
    setAll((l) => l.filter((x) => x._id !== r._id));
    await fetch(`/api/admin/reviews/${r._id}`, { method: 'DELETE' });
  };

  const counts = useMemo(() => Object.fromEntries(TABS.map(([k]) => [k, (all || []).filter((r) => !k || r.status === k).length])), [all]);
  const shown = (all || []).filter((r) => !tab || r.status === tab);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Réputation</p><h1 className="font-serif text-4xl">Avis clients</h1></div>
        <button onClick={() => setAdding(true)} className="btn-gold py-2.5"><Plus className="h-4 w-4" /> Ajouter un avis</button>
      </header>
      <p className="max-w-3xl text-sm text-cream/55">
        N’ajoutez que des avis réellement reçus de vos clients (site, WhatsApp, Instagram, boutique) — sans les modifier sur le fond.<br />
        Les avis déposés sur le site arrivent <b className="text-gold-300">en attente</b> et ne sont visibles qu’après validation.
        Les avis <Sparkles className="inline h-3.5 w-3.5 text-gold-400" /> <b className="text-gold-300">mis en avant</b> s’affichent sur la page d’accueil. La note de chaque produit est recalculée automatiquement.
      </p>

      {samples > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-terracotta-600/50 bg-terracotta/15 p-4 text-sm">
          <span className="flex-1">Votre site contient encore <b>{samples} avis d’exemple</b> créés pour la démo. Supprimez-les pour n’afficher que de vrais avis clients.</span>
          <button onClick={clearSamples} className="btn-outline min-h-[40px] py-2"><Eraser className="h-4 w-4" /> Supprimer les avis d’exemple</button>
        </div>
      )}

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition ${tab === k ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-gold-500/20 text-cream/60 hover:text-cream'}`}>
            {l} {all && <span className={k === 'pending' && counts.pending ? 'ml-1 rounded-full bg-terracotta px-1.5 text-cream' : 'opacity-60'}>({counts[k]})</span>}
          </button>
        ))}
      </div>

      {!all ? <div className="grid place-items-center p-16"><Loader2 className="h-6 w-6 animate-spin text-gold-400" /></div>
        : shown.length === 0 ? <p className="card-lux p-12 text-center text-sm text-cream/50">Aucun avis dans cette catégorie.</p> : (
        <ul className="grid gap-4 xl:grid-cols-2">
          {shown.map((r) => (
            <li key={r._id} className={`card-lux p-5 ${r.featured ? 'ring-1 ring-gold-400/60' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-500">{r.productName}</p>
                  <p className="mt-1 font-semibold text-cream">{r.name} <span className="font-normal text-cream/45">· {r.city || '—'} · {new Date(r.createdAt).toLocaleDateString('fr-MA')}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} size={13} />
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${BADGE[r.status]}`}>{LABEL[r.status]}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {r.verified && <span className="inline-flex items-center gap-1 rounded-full bg-forest-600/60 px-2 py-0.5 text-gold-200"><BadgeCheck className="h-3.5 w-3.5" /> Achat vérifié{r.orderRef ? ` · ${r.orderRef}` : ''}</span>}
                {!r.verified && r.orderRef && <span className="rounded-full border border-terracotta-600/50 px-2 py-0.5 text-cream/60">N° {r.orderRef} non trouvé</span>}
                {r.source && r.source !== 'site' && <span className="rounded-full border border-gold-500/30 px-2 py-0.5 text-cream/60">via {r.source}</span>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">{r.text}</p>
              {r.photos?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.photos.map((src) => (
                    <a key={src} href={src} target="_blank" rel="noopener" className="block h-16 w-16 overflow-hidden rounded-lg border border-gold-500/25">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
              {r.reply && <p className="mt-3 border-l-2 border-gold-500/60 pl-3 text-xs italic text-gold-200/80">Réponse : {r.reply}</p>}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-gold-500/10 pt-4">
                {r.status !== 'approved' && <Btn onClick={() => patch(r._id, { status: 'approved' })} cls="bg-forest-600 text-cream hover:bg-forest-700"><Check className="h-3.5 w-3.5" /> Publier</Btn>}
                {r.status !== 'rejected' && <Btn onClick={() => patch(r._id, { status: 'rejected', featured: false })} cls="border border-gold-500/25 text-cream/70 hover:text-cream"><X className="h-3.5 w-3.5" /> Refuser</Btn>}
                {r.status === 'approved' && (
                  <Btn onClick={() => patch(r._id, { featured: !r.featured })} cls={r.featured ? 'bg-gold-400 text-forest-900' : 'border border-gold-500/40 text-gold-300 hover:bg-gold-500/10'}>
                    <Sparkles className="h-3.5 w-3.5" /> {r.featured ? 'Sur l’accueil' : 'Mettre en avant'}
                  </Btn>
                )}
                <Btn onClick={() => setEditing(r)} cls="border border-gold-500/25 text-cream/70 hover:text-cream"><Pencil className="h-3.5 w-3.5" /> Modifier / répondre</Btn>
                <Btn onClick={() => del(r)} cls="ml-auto text-cream/45 hover:bg-terracotta/30 hover:text-cream"><Trash2 className="h-3.5 w-3.5" /></Btn>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(editing || adding) && (
        <ReviewEditor review={editing} products={products} onClose={() => { setEditing(null); setAdding(false); }}
          onSaved={() => { setEditing(null); setAdding(false); load(); }} />
      )}
    </div>
  );
}

const Btn = ({ children, onClick, cls }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${cls}`}>{children}</button>
);

function ReviewEditor({ review, products, onClose, onSaved }) {
  const isNew = !review;
  const [f, setF] = useState(review ? { photos: [], source: 'site', ...review } : { product: products[0]?.slug || '', name: '', city: '', rating: 5, text: '', reply: '', status: 'approved', featured: false, photos: [], source: 'whatsapp', verified: false, orderRef: '' });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const on = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    const res = await fetch(isNew ? '/api/admin/reviews' : `/api/admin/reviews/${review._id}`, {
      method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: f.product, name: f.name, city: f.city, rating: Number(f.rating), text: f.text, reply: f.reply, status: f.status, featured: f.featured, photos: f.photos, source: f.source, verified: f.verified, orderRef: f.orderRef }),
    });
    if (res.ok) onSaved(); else { setErr((await res.json()).error); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-lg space-y-4 overflow-y-auto border-l border-gold-500/20 bg-forest-950/85 p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between"><h2 className="font-serif text-3xl">{isNew ? 'Ajouter un avis' : 'Modifier l’avis'}</h2><button type="button" onClick={onClose} className="text-gold-300" aria-label="Fermer"><X /></button></div>
        {isNew && (
          <div><label className="label-lux">Produit</label>
            <select value={f.product} onChange={on('product')} className="input-lux">{products.map((p) => <option key={p.slug} value={p.slug} className="bg-forest-900">{p.name}</option>)}</select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label-lux">Nom</label><input required value={f.name} onChange={on('name')} className="input-lux" /></div>
          <div><label className="label-lux">Ville</label><input value={f.city} onChange={on('city')} className="input-lux" /></div>
        </div>
        <div>
          <label className="label-lux">Note</label>
          <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setF((s) => ({ ...s, rating: n }))} aria-label={`${n} étoiles`}>
              <Star className={`h-7 w-7 ${f.rating >= n ? 'fill-gold-400 text-gold-400' : 'text-gold-500/30'}`} />
            </button>))}
          </div>
        </div>
        <div><label className="label-lux">Avis (texte exact du client)</label><textarea required rows={5} value={f.text} onChange={on('text')} className="input-lux" /></div>
        <ImageUploader value={f.photos || []} onChange={(photos) => setF((s) => ({ ...s, photos }))} kind="review" max={6} label="Photos du client (capture WhatsApp, photo produit…)" />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label-lux">Source</label>
            <select value={f.source || 'site'} onChange={on('source')} className="input-lux">
              <option value="site" className="bg-forest-900">Site web</option><option value="whatsapp" className="bg-forest-900">WhatsApp</option>
              <option value="instagram" className="bg-forest-900">Instagram</option><option value="boutique" className="bg-forest-900">En boutique</option>
            </select>
          </div>
          <div><label className="label-lux">N° de commande</label><input value={f.orderRef || ''} onChange={on('orderRef')} className="input-lux uppercase" placeholder="NT-…" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.verified} onChange={on('verified')} className="h-4 w-4 accent-[#D4AF37]" /> Achat vérifié (vous avez bien livré ce client)</label>
        <div><label className="label-lux flex items-center gap-2"><MessageSquareReply className="h-3.5 w-3.5" /> Réponse de la marque (publique)</label><textarea rows={3} value={f.reply || ''} onChange={on('reply')} className="input-lux" placeholder="Merci beaucoup pour votre confiance…" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label-lux">Statut</label>
            <select value={f.status} onChange={on('status')} className="input-lux">
              <option value="approved" className="bg-forest-900">Publié</option><option value="pending" className="bg-forest-900">En attente</option><option value="rejected" className="bg-forest-900">Refusé</option>
            </select>
          </div>
          <label className="mt-7 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.featured} onChange={on('featured')} className="h-4 w-4 accent-[#D4AF37]" /> Sur l’accueil</label>
        </div>
        {err && <p className="text-sm text-terracotta-600">{err}</p>}
        <button className="btn-gold w-full" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer</button>
      </form>
    </div>
  );
}
