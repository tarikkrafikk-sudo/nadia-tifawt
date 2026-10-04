'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Search } from 'lucide-react';
import { formatMAD } from '@/lib/utils';
import ImageUploader from './ImageUploader';
import { CATEGORIES } from '@/lib/catalog';

const EMPTY = { name: '', nameAr: '', slug: '', category: 'miel', price: '', compareAtPrice: '', size: '', stock: 0, images: [], shortDescription: '', description: '', ingredients: '', usage: '', bestseller: false, featured: false, active: true, i18n: { en: {}, ar: {} } };

export default function AdminProducts() {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null); // null | product | EMPTY

  const load = () => fetch('/api/admin/products').then((r) => r.json()).then((d) => setList(d.products));
  useEffect(() => { load(); }, []);

  const patch = async (id, data) => {
    setList((l) => l.map((p) => (p._id === id ? { ...p, ...data } : p)));
    await fetch(`/api/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  };
  const del = async (p) => {
    if (!window.confirm(`Supprimer « ${p.name} » ?`)) return;
    await fetch(`/api/admin/products/${p._id}`, { method: 'DELETE' });
    load();
  };

  const shown = (list || []).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Catalogue</p><h1 className="font-serif text-3xl sm:text-4xl">Produits, prix & stock</h1></div>
        <button onClick={() => setEdit(EMPTY)} className="btn-gold py-2.5"><Plus className="h-4 w-4" /> Nouveau produit</button>
      </header>

      <BulkPrice list={list} onDone={load} />

      <label className="relative block max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="input-lux pl-11" />
      </label>

      {/* Mobile : cartes */}
      <ul className="space-y-3 md:hidden">
        {(shown || []).map((p) => (
          <li key={p._id} className="card-lux p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gold-500/20">{p.images?.[0] && <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />}</div>
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{p.name}</p><p className="text-xs text-cream/45">{CATEGORIES.find((c) => c.slug === p.category)?.name} · {p.size}</p></div>
              <button onClick={() => setEdit({ ...EMPTY, ...p, i18n: { en: { ...(p.i18n?.en || {}) }, ar: { ...(p.i18n?.ar || {}) } }, images: [...(p.images || [])], compareAtPrice: p.compareAtPrice ?? '' })} className="grid h-10 w-10 place-items-center rounded-lg text-gold-300 hover:bg-gold-500/10" aria-label="Modifier"><Pencil className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.15em] text-cream/45">
              <label className="space-y-1"><span>Prix</span><PriceInput value={p.price} label="Prix" onSave={(v) => patch(p._id, { price: v })} /></label>
              <label className="space-y-1"><span>Barré</span><PriceInput value={p.compareAtPrice} label="Prix barré" muted onSave={(v) => patch(p._id, { compareAtPrice: v })} /></label>
              <label className="space-y-1"><span>Stock</span>
                <input type="number" min={0} defaultValue={p.stock} aria-label="Stock" onBlur={(e) => Number(e.target.value) !== p.stock && patch(p._id, { stock: Number(e.target.value) })}
                  className={`input-lux w-full px-2 py-1.5 text-center ${p.stock === 0 ? 'border-terracotta-600 text-terracotta-600' : ''}`} />
              </label>
            </div>
            <div className="mt-4 flex items-center gap-5 text-xs text-cream/60">
              <span className="flex items-center gap-2"><Toggle on={p.bestseller} onChange={(v) => patch(p._id, { bestseller: v })} /> Best-seller</span>
              <span className="flex items-center gap-2"><Toggle on={p.active !== false} onChange={(v) => patch(p._id, { active: v })} /> En ligne</span>
              <button onClick={() => del(p)} className="ms-auto grid h-10 w-10 place-items-center rounded-lg text-cream/50 hover:bg-terracotta/30" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>

      <div className="card-lux hidden overflow-x-auto md:block">
        {!list ? <div className="grid place-items-center p-16"><Loader2 className="h-6 w-6 animate-spin text-gold-400" /></div> : (
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.2em] text-cream/45">
              <tr className="border-b border-gold-500/10">
                <th className="p-4">Produit</th><th className="p-4">Catégorie</th><th className="p-4">Prix · Prix barré (DH)</th><th className="p-4">Stock</th><th className="p-4">Best-seller</th><th className="p-4">En ligne</th><th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {shown.map((p) => (
                <tr key={p._id} className="hover:bg-forest-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gold-500/20">{p.images?.[0] && <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />}</div>
                      <div><p className="font-medium">{p.name}</p><p className="text-xs text-cream/45">{p.size}</p></div>
                    </div>
                  </td>
                  <td className="p-4 text-cream/70">{CATEGORIES.find((c) => c.slug === p.category)?.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <PriceInput value={p.price} label="Prix" onSave={(v) => patch(p._id, { price: v })} />
                      <PriceInput value={p.compareAtPrice} label="Prix barré" muted onSave={(v) => patch(p._id, { compareAtPrice: v })} />
                    </div>
                  </td>
                  <td className="p-4">
                    <input type="number" min={0} defaultValue={p.stock} aria-label="Stock"
                      onBlur={(e) => Number(e.target.value) !== p.stock && patch(p._id, { stock: Number(e.target.value) })}
                      className={`input-lux w-20 px-2 py-1.5 text-center ${p.stock === 0 ? 'border-terracotta-600 text-terracotta-600' : p.stock <= 5 ? 'border-gold-400' : ''}`} />
                  </td>
                  <td className="p-4"><Toggle on={p.bestseller} onChange={(v) => patch(p._id, { bestseller: v })} /></td>
                  <td className="p-4"><Toggle on={p.active !== false} onChange={(v) => patch(p._id, { active: v })} /></td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEdit({ ...EMPTY, ...p, i18n: { en: { ...(p.i18n?.en || {}) }, ar: { ...(p.i18n?.ar || {}) } }, images: [...(p.images || [])], compareAtPrice: p.compareAtPrice ?? '' })} className="rounded-lg p-2 text-gold-300 hover:bg-gold-500/10" aria-label="Modifier"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => del(p)} className="rounded-lg p-2 text-cream/50 hover:bg-terracotta/30 hover:text-cream" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {edit && <ProductForm initial={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
    </div>
  );
}

function PriceInput({ value, onSave, label, muted }) {
  const [v, setV] = useState(value ?? '');
  const [ok, setOk] = useState(false);
  useEffect(() => setV(value ?? ''), [value]);
  const commit = () => {
    const n = v === '' ? (muted ? '' : value) : Math.max(0, Number(v));
    if (String(n) === String(value ?? '')) return;
    onSave(n === '' ? '' : n);
    setOk(true); setTimeout(() => setOk(false), 1200);
  };
  return (
    <input type="number" min={0} step="1" aria-label={label} title={label} value={v} placeholder={muted ? '—' : ''}
      onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      className={`input-lux w-full px-2 py-1.5 text-center transition md:w-24 ${ok ? 'border-forest-600 ring-1 ring-forest-600' : ''} ${muted ? 'text-cream/50 line-through decoration-cream/30' : 'font-semibold text-gold-300'}`} />
  );
}

function BulkPrice({ list, onDone }) {
  const [cat, setCat] = useState('');
  const [pct, setPct] = useState('');
  const [busy, setBusy] = useState(false);
  const apply = async () => {
    const k = Number(pct);
    if (!k || !list) return;
    const targets = list.filter((p) => !cat || p.category === cat);
    if (!window.confirm(`${k > 0 ? 'Augmenter' : 'Baisser'} de ${Math.abs(k)} % le prix de ${targets.length} produit(s) ?`)) return;
    setBusy(true);
    for (const p of targets) {
      await fetch(`/api/admin/products/${p._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: Math.round(p.price * (1 + k / 100)) }) });
    }
    setBusy(false); setPct(''); onDone();
  };
  return (
    <div className="card-lux flex flex-wrap items-center gap-3 p-4 text-sm [&_select]:min-w-0">
      <span className="text-cream/70">Ajuster les prix en masse :</span>
      <select value={cat} onChange={(e) => setCat(e.target.value)} className="input-lux w-auto py-2">
        <option value="" className="bg-forest-900">Toutes les catégories</option>
        {CATEGORIES.map((c) => <option key={c.slug} value={c.slug} className="bg-forest-900">{c.name}</option>)}
      </select>
      <input type="number" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="+10 ou -5" className="input-lux w-28 py-2" aria-label="Pourcentage" />
      <span className="text-cream/50">%</span>
      <button onClick={apply} disabled={busy || !Number(pct)} className="btn-outline py-2">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Appliquer</button>
      <span className="text-xs text-cream/40">Astuce : modifiez un prix directement dans le tableau puis touche Entrée.</span>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-gold-500' : 'bg-forest-700'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function ProductForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const isNew = !initial._id;
  const on = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    const { _id, createdAt, updatedAt, reviews, rating, reviewsCount, ...body } = f;
    const res = await fetch(isNew ? '/api/admin/products' : `/api/admin/products/${_id}`, {
      method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (res.ok) onSaved();
    else { setErr((await res.json()).error); setSaving(false); }
  };

  const F = ({ k, label, type = 'text', span, ...rest }) => (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label className="label-lux" htmlFor={k}>{label}</label>
      {type === 'textarea'
        ? <textarea id={k} rows={3} value={f[k]} onChange={on(k)} className="input-lux" {...rest} />
        : <input id={k} type={type} value={f[k]} onChange={on(k)} className="input-lux" {...rest} />}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-2xl overflow-y-auto border-l border-gold-500/20 bg-forest-950/85 p-6 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-3xl">{isNew ? 'Nouveau produit' : 'Modifier le produit'}</h2>
          <button type="button" onClick={onClose} className="text-gold-300" aria-label="Fermer"><X /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {F({ k: 'name', label: 'Nom *', required: true, span: true })}
          {F({ k: 'nameAr', label: 'Nom en arabe', dir: 'rtl' })}
          {F({ k: 'slug', label: 'Slug (URL)', placeholder: 'auto depuis le nom' })}
          <div>
            <label className="label-lux" htmlFor="category">Catégorie *</label>
            <select id="category" value={f.category} onChange={on('category')} className="input-lux">
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug} className="bg-forest-900">{c.name}</option>)}
            </select>
          </div>
          {F({ k: 'size', label: 'Contenance', placeholder: '500 g' })}
          {F({ k: 'price', label: 'Prix (DH) *', type: 'number', min: 0, required: true })}
          {F({ k: 'compareAtPrice', label: 'Prix barré (DH)', type: 'number', min: 0 })}
          {F({ k: 'stock', label: 'Stock', type: 'number', min: 0 })}
          <div className="sm:col-span-2"><ImageUploader value={f.images || []} onChange={(images) => setF((s) => ({ ...s, images }))} label="Photos du produit" /></div>
          {F({ k: 'shortDescription', label: 'Accroche', span: true })}
          {F({ k: 'description', label: 'Description', type: 'textarea', span: true })}
          {F({ k: 'ingredients', label: 'Ingrédients', type: 'textarea', span: true })}
          {F({ k: 'usage', label: 'Utilisation', type: 'textarea', span: true })}
          {[['en', 'English'], ['ar', 'العربية']].map(([l, label]) => (
            <fieldset key={l} className="space-y-3 rounded-xl border border-gold-500/20 p-4 sm:col-span-2" dir={l === 'ar' ? 'rtl' : 'ltr'}>
              <legend className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Traduction · {label}</legend>
              {[['name', 'Nom'], ['size', 'Contenance'], ['shortDescription', 'Accroche'], ['description', 'Description', true], ['ingredients', 'Ingrédients', true], ['usage', 'Utilisation', true]].map(([k, lab, area]) => {
                const val = f.i18n?.[l]?.[k] || '';
                const set = (e) => setF((s) => ({ ...s, i18n: { ...s.i18n, [l]: { ...(s.i18n?.[l] || {}), [k]: e.target.value } } }));
                return (
                  <div key={k}>
                    <label className="label-lux">{lab}</label>
                    {area ? <textarea rows={2} value={val} onChange={set} className="input-lux" /> : <input value={val} onChange={set} className="input-lux" />}
                  </div>
                );
              })}
            </fieldset>
          ))}
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            {[['bestseller', 'Best-seller'], ['featured', 'Mis en avant'], ['active', 'En ligne']].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f[k]} onChange={on(k)} className="h-4 w-4 accent-[#D4AF37]" /> {l}</label>
            ))}
          </div>
        </div>
        {err && <p className="mt-4 text-sm text-terracotta-600">{err}</p>}
        <div className="mt-8 flex gap-3">
          <button className="btn-gold flex-1" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer</button>
          <button type="button" onClick={onClose} className="btn-outline">Annuler</button>
        </div>
      </form>
    </div>
  );
}
