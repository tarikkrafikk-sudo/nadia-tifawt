'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Camera, X, Loader2, Star, ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import { uploadImage } from '@/lib/client-image';

/**
 * Galerie d'images téléversables (téléphone ou ordinateur).
 * value : tableau d'URLs — la 1re image est la photo principale.
 */
export default function ImageUploader({ value = [], onChange, endpoint = '/api/admin/upload', kind = 'product', max = 8, label = 'Photos' }) {
  const pick = useRef(null);
  const cam = useRef(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState('');
  const [drag, setDrag] = useState(false);
  const [url, setUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);

  const add = async (files) => {
    const list = Array.from(files || []).slice(0, Math.max(0, max - value.length));
    if (!list.length) return;
    setErr(''); setBusy(list.length);
    const out = [...value];
    for (const f of list) {
      try { out.push(await uploadImage(f, endpoint, { kind })); onChange([...out]); }
      catch (e) { setErr(e.message); }
      setBusy((n) => n - 1);
    }
  };
  const remove = (i) => onChange(value.filter((_, k) => k !== i));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const a = [...value]; [a[i], a[j]] = [a[j], a[i]]; onChange(a);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="label-lux mb-0">{label} <span className="normal-case tracking-normal text-cream/40">({value.length}/{max})</span></span>
        <button type="button" onClick={() => setShowUrl((s) => !s)} className="flex items-center gap-1 text-[11px] text-cream/45 hover:text-gold-300"><Link2 className="h-3 w-3" /> URL</button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed p-3 transition ${drag ? 'border-gold-400 bg-gold-500/10' : 'border-gold-500/25'}`}
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <div key={src + i} className={`group relative aspect-square overflow-hidden rounded-xl border ${i === 0 ? 'border-gold-400 ring-1 ring-gold-400' : 'border-gold-500/20'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute start-1 top-1 flex items-center gap-1 rounded-full bg-gold-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-forest-900"><Star className="h-2.5 w-2.5" /> Principale</span>}
              <button type="button" onClick={() => remove(i)} aria-label="Retirer la photo"
                className="absolute end-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white"><X className="h-4 w-4" /></button>
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Avant" className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white disabled:opacity-0"><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Après" className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white disabled:opacity-0"><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
              </div>
            </div>
          ))}
          {[...Array(busy)].map((_, i) => (
            <div key={`b${i}`} className="grid aspect-square place-items-center rounded-xl border border-gold-500/20 bg-forest-950/60"><Loader2 className="h-5 w-5 animate-spin text-gold-400" /></div>
          ))}
          {value.length + busy < max && (
            <button type="button" onClick={() => pick.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-gold-500/25 bg-forest-950/40 text-gold-300 transition hover:border-gold-400 hover:bg-gold-500/10">
              <ImagePlus className="h-6 w-6" /><span className="text-[10px] font-semibold uppercase tracking-wider">Ajouter</span>
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => pick.current?.click()} className="btn-outline min-h-[40px] flex-1 px-4 py-2 text-[11px]"><ImagePlus className="h-4 w-4" /> Choisir des photos</button>
          <button type="button" onClick={() => cam.current?.click()} className="btn-outline min-h-[40px] flex-1 px-4 py-2 text-[11px] md:hidden"><Camera className="h-4 w-4" /> Prendre une photo</button>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-cream/40 md:block">…ou glissez-déposez vos photos ici · JPG, PNG, WEBP</p>

        <input ref={pick} type="file" accept="image/jpeg,image/png,image/webp,image/*" multiple className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
        <input ref={cam} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
      </div>

      {showUrl && (
        <div className="mt-2 flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… ou /images/…" className="input-lux py-2 text-sm" />
          <button type="button" onClick={() => { if (url.trim()) { onChange([...value, url.trim()]); setUrl(''); } }} className="btn-outline min-h-[40px] px-4 py-2 text-[11px]">Ajouter</button>
        </div>
      )}
      {err && <p className="mt-2 text-sm text-terracotta-600">{err}</p>}
      <p className="mt-1 text-[11px] text-cream/40">La 1re photo est la photo principale. Les photos sont automatiquement réduites pour un site rapide.</p>
    </div>
  );
}
