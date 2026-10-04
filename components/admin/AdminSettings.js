'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Upload, Check, ExternalLink, Info } from 'lucide-react';
import OnssaBadge from '@/components/layout/OnssaBadge';

export default function AdminSettings() {
  const [o, setO] = useState(null);
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { fetch('/api/admin/settings').then((r) => r.json()).then((s) => { setO(s.onssa); setC(s.company); }); }, []);
  const onC = (k) => (e) => setC((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const on = (k) => (e) => setO((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true); setMsg({});
    const res = await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ onssa: o, company: c }) });
    const data = await res.json();
    setSaving(false);
    if (res.ok) { setO(data.onssa); setC(data.company); setMsg({ type: 'ok', text: 'Enregistré — le pied de page du site est à jour.' }); }
    else setMsg({ type: 'err', text: data.error });
  };

  const upload = async (file) => {
    if (!file) return;
    setUploading(true); setMsg({});
    const fd = new FormData(); fd.append('file', file); fd.append('kind', 'onssa');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setO((s) => ({ ...s, document: data.url })); else setMsg({ type: 'err', text: data.error });
  };

  if (!o || !c) return <div className="grid place-items-center p-16"><Loader2 className="h-6 w-6 animate-spin text-gold-400" /></div>;

  return (
    <div className="space-y-8">
      <header><p className="eyebrow">Réglages</p><h1 className="font-serif text-3xl sm:text-4xl">Informations légales & ONSSA</h1></header>

      <form onSubmit={save} className="card-lux space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">Identifiants de l’entreprise</h2>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!c.showInFooter} onChange={onC('showInFooter')} className="h-4 w-4 accent-[#D4AF37]" /> Afficher dans le pied de page</label>
        </div>
        <p className="text-xs text-cream/50">Ces informations apparaissent en bas de chaque page et sur la page « Mentions légales ». Elles doivent être celles de l’entreprise qui vend sur le site.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[['tradeName', 'Nom commercial'], ['legalName', 'Titulaire (nom et prénom)'], ['status', 'Statut juridique'], ['ice', 'ICE (15 chiffres)'], ['taxId', 'Identifiant fiscal (IF)'], ['tp', 'Taxe professionnelle (TP)'], ['aeNumber', 'N° dossier auto-entrepreneur'], ['rc', 'RC (si société)'], ['address', 'Adresse'], ['email', 'E-mail'], ['phone', 'Téléphone']].map(([k, l]) => (
            <div key={k}><label className="label-lux">{l}</label><input value={c[k] || ''} onChange={onC(k)} className={`input-lux ${['ice', 'taxId', 'tp', 'aeNumber', 'rc'].includes(k) ? 'font-mono' : ''}`} /></div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-gold" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer</button>
          <a href="/mentions-legales" target="_blank" className="inline-flex items-center gap-1 text-sm text-gold-300 hover:underline">Voir les mentions légales <ExternalLink className="h-3.5 w-3.5" /></a>
          {msg.text && <p className={`text-sm ${msg.type === 'ok' ? 'text-gold-300' : 'text-terracotta-600'}`}>{msg.text}</p>}
        </div>
      </form>

      <h2 className="pt-4 font-serif text-3xl">Attestation ONSSA</h2>

      <div className="flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-4 text-sm text-cream/75">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
        <p>
          Saisissez uniquement le numéro figurant sur l’attestation <b>délivrée par l’ONSSA à votre propre établissement</b>.
          Afficher le numéro d’un autre établissement est interdit et vérifiable par vos clients et par l’ONSSA.
          Si vous n’avez pas encore d’autorisation, la demande se fait auprès du service vétérinaire / de la direction régionale ONSSA de votre ville.
        </p>
      </div>

      <form onSubmit={save} className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="card-lux space-y-5 p-6">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-gold-500/20 p-4">
            <span><b className="block text-cream">Afficher le badge sur le site</b><span className="text-xs text-cream/50">Pied de page de toutes les pages + page « Qualité »</span></span>
            <input type="checkbox" checked={!!o.enabled} onChange={on('enabled')} className="h-5 w-5 accent-[#D4AF37]" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label-lux">Type</label>
              <select value={o.type} onChange={on('type')} className="input-lux">
                <option className="bg-forest-900">Autorisation sanitaire</option>
                <option className="bg-forest-900">Agrément sanitaire</option>
              </select>
            </div>
            <div><label className="label-lux">Numéro *</label><input value={o.number} onChange={on('number')} placeholder="tel qu’inscrit sur l’attestation" className="input-lux font-mono" /></div>
            <div><label className="label-lux">Titulaire (raison sociale)</label><input value={o.holder} onChange={on('holder')} className="input-lux" /></div>
            <div><label className="label-lux">Ville</label><input value={o.city} onChange={on('city')} className="input-lux" /></div>
            <div className="sm:col-span-2"><label className="label-lux">Activité autorisée</label><input value={o.activity} onChange={on('activity')} className="input-lux" /></div>
            <div><label className="label-lux">Date de délivrance</label><input type="date" value={o.issuedAt} onChange={on('issuedAt')} className="input-lux" /></div>
          </div>

          <div>
            <label className="label-lux">Attestation (scan PDF ou photo)</label>
            <div className="flex flex-wrap items-center gap-3">
              <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline py-2.5" disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Téléverser
              </button>
              {o.document && <a href={o.document} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm text-gold-300 underline-offset-4 hover:underline"><Check className="h-4 w-4" /> Fichier actuel <ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
            <input value={o.document} onChange={on('document')} placeholder="…ou collez une URL (Cloudinary, Drive public…)" className="input-lux mt-3 text-xs" />
          </div>

          {msg.text && <p className={`text-sm ${msg.type === 'ok' ? 'text-gold-300' : 'text-terracotta-600'}`}>{msg.text}</p>}
          <button className="btn-gold w-full" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer</button>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Aperçu du pied de page</p>
          <div className="rounded-3xl bg-forest-950/50 py-6 [&_.container]:px-4">
            {o.number ? <OnssaBadge onssa={{ ...o, enabled: true }} /> : <p className="p-10 text-center text-sm text-cream/40">Saisissez le numéro pour voir l’aperçu.</p>}
          </div>
          <a href="/qualite" target="_blank" className="inline-flex items-center gap-1 text-sm text-gold-300 hover:underline">Voir la page Qualité <ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
      </form>
    </div>
  );
}
