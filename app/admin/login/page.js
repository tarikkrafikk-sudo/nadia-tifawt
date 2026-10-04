'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) window.location.href = '/admin';
    else { setErr((await res.json()).error); setLoading(false); }
  };

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <form onSubmit={submit} className="card-lux w-full max-w-sm p-8 text-center">
        <span className="mx-auto block h-20 w-20 rounded-full bg-gold-metal p-[2px]"><Image src="/images/emblem.png" alt="" width={160} height={160} className="rounded-full" /></span>
        <h1 className="text-gold-metal mt-5 font-serif text-3xl">Espace Admin</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-cream/50">Nadia Tifawt</p>
        <input type="password" required autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mot de passe" className="input-lux mt-8" aria-label="Mot de passe" />
        {err && <p className="mt-3 text-sm text-terracotta-600">{err}</p>}
        <button className="btn-gold mt-6 w-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Se connecter</button>
      </form>
    </main>
  );
}
