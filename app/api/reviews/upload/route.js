import { NextResponse } from 'next/server';
import { saveUpload } from '@/lib/uploads';

const hits = globalThis._ntReviewUploads || (globalThis._ntReviewUploads = new Map());

// Photos jointes à un avis client (3 max par avis, 10 photos / 10 min / IP)
export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 10) return NextResponse.json({ error: 'Trop de photos envoyées, réessayez plus tard.' }, { status: 429 });
  try {
    const url = await saveUpload((await req.formData()).get('file'), 'avis', { maxBytes: 5 * 1024 * 1024 });
    hits.set(ip, [...recent, now]);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
