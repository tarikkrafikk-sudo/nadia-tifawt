import { NextResponse } from 'next/server';
import { createReview } from '@/lib/data';

const hits = globalThis._ntReviewHits || (globalThis._ntReviewHits = new Map());

// Dépôt d'un avis par un client — toujours « en attente » jusqu'à validation dans /admin/avis
export async function POST(req) {
  try {
    const body = await req.json();
    if (body.website) return NextResponse.json({ ok: true }); // pot de miel anti-spam
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
    const last = hits.get(ip) || 0;
    if (Date.now() - last < 60_000) return NextResponse.json({ error: 'Merci de patienter une minute avant un nouvel avis.' }, { status: 429 });
    hits.set(ip, Date.now());
    await createReview(body);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
