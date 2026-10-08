import { NextResponse } from 'next/server';
import { saveUpload, IMAGE_TYPES, DOC_TYPES } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Téléversement depuis l'admin : photos produits, photos d'avis, attestation (PDF accepté) → Cloudinary.
export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const kind = String(form.get('kind') || 'product');
    const types = kind === 'onssa' ? DOC_TYPES : IMAGE_TYPES;
    const prefix = { product: 'produit', review: 'avis', onssa: 'attestation-onssa' }[kind] || 'fichier';
    const url = await saveUpload(file, prefix, { types });
    return NextResponse.json({ url });
  } catch (e) {
    console.error('[upload]', e);
    const msg = e?.message || e?.error?.message || 'Téléversement impossible.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
