'use client';
import { useState } from 'react';
import { Star, Loader2, CheckCircle2, ImagePlus, X } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { uploadImage } from '@/lib/client-image';

// Formulaire d'avis client. Avec `products`, le client choisit le produit (page d'accueil).
export default function ReviewForm({ product, products, className = '' }) {
  const { t } = useI18n();
  const [f, setF] = useState({ name: '', city: '', rating: 5, text: '', website: '', orderRef: '', product: product?.slug || products?.[0]?.slug || '' });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(0);
  const addPhotos = async (files) => {
    const list = Array.from(files || []).slice(0, 3 - photos.length);
    setUploading(list.length);
    for (const file of list) {
      try { const url = await uploadImage(file, '/api/reviews/upload'); setPhotos((p) => [...p, url]); }
      catch (err) { setState((s) => ({ ...s, error: err.message })); }
      setUploading((n) => n - 1);
    }
  };
  const [hover, setHover] = useState(0);
  const [state, setState] = useState({ loading: false, done: false, error: '' });
  const on = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ loading: true, done: false, error: '' });
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, photos }) });
    const data = await res.json();
    setState({ loading: false, done: res.ok, error: res.ok ? '' : data.error });
  };

  if (state.done)
    return (
      <div className={`card-lux flex h-fit flex-col items-center gap-3 p-8 text-center ${className}`}>
        <CheckCircle2 className="h-10 w-10 text-gold-400" strokeWidth={1.3} />
        <p className="font-serif text-2xl text-cream">{t('product.form.thanks')}</p>
        <p className="text-sm text-cream/60">{t('product.form.pending')}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className={`card-lux h-fit space-y-4 p-6 text-start ${className}`}>
      <h3 className="font-serif text-2xl text-cream">{t('product.form.title')}</h3>
      {products && (
        <select value={f.product} onChange={on('product')} aria-label={t('testi.product')} className="input-lux">
          {products.map((p) => <option key={p.slug} value={p.slug} className="bg-forest-900">{p.name}</option>)}
        </select>
      )}
      <div className="flex gap-1" role="radiogroup" aria-label={t('product.form.rating')}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} role="radio" aria-checked={f.rating === n} aria-label={t('product.form.star', { n })}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setF((s) => ({ ...s, rating: n }))}>
            <Star className={`h-7 w-7 transition ${(hover || f.rating) >= n ? 'fill-gold-400 text-gold-400' : 'text-gold-500/30'}`} />
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required value={f.name} onChange={on('name')} placeholder={t('product.form.name')} aria-label={t('product.form.name')} className="input-lux" />
        <input value={f.city} onChange={on('city')} placeholder={t('product.form.city')} aria-label={t('product.form.city')} className="input-lux" />
      </div>
      <textarea required minLength={10} rows={4} value={f.text} onChange={on('text')} placeholder={t('product.form.text')} aria-label={t('product.form.text')} className="input-lux" />
      <div>
        <p className="mb-2 text-xs text-cream/60">{t('rv.photos')}</p>
        <div className="flex flex-wrap gap-2">
          {photos.map((src) => (
            <div key={src} className="relative h-16 w-16 overflow-hidden rounded-lg border border-gold-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => setPhotos((p) => p.filter((x) => x !== src))} className="absolute end-0.5 top-0.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white" aria-label="X"><X className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          {[...Array(uploading)].map((_, i) => <div key={i} className="grid h-16 w-16 place-items-center rounded-lg border border-gold-500/30"><Loader2 className="h-4 w-4 animate-spin text-gold-400" /></div>)}
          {photos.length + uploading < 3 && (
            <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-gold-500/40 text-gold-300 hover:bg-gold-500/10">
              <ImagePlus className="h-5 w-5" /><span className="text-[9px] uppercase">{t('rv.addPhoto')}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }} />
            </label>
          )}
        </div>
      </div>
      <div>
        <input value={f.orderRef} onChange={on('orderRef')} placeholder={t('rv.orderRef')} aria-label={t('rv.orderRef')} dir="ltr" className="input-lux uppercase rtl:text-right" />
        <p className="mt-1 text-[11px] text-cream/40">{t('rv.orderRefHint')}</p>
      </div>
      <input tabIndex={-1} autoComplete="off" value={f.website} onChange={on('website')} className="hidden" aria-hidden />
      {state.error && <p className="text-sm text-terracotta-600">{state.error}</p>}
      <button className="btn-gold w-full" disabled={state.loading || uploading > 0}>{state.loading && <Loader2 className="h-4 w-4 animate-spin" />} {t('product.form.send')}</button>
      <p className="text-[11px] text-cream/40">{t('product.form.note')}</p>
    </form>
  );
}
