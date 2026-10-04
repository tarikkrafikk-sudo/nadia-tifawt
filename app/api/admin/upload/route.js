import { NextResponse } from 'next/server';
import { saveUpload, IMAGE_TYPES, DOC_TYPES } from '@/lib/uploads';

// Téléversement depuis l'admin : photos produits, photos d'avis, attestation (PDF accepté).
export async function POST(req) {
  try {
    const form = await req.formData();
    const kind = String(form.get('kind') || 'product');
    const opts = kind === 'onssa' ? { types: DOC_TYPES } : { types: IMAGE_TYPES };
    const prefix = { product: 'produit', review: 'avis', onssa: 'attestation-onssa' }[kind] || 'fichier';
    const url = await saveUpload(form.get('file'), prefix, opts);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Téléversement impossible.' }, { status: 400 });
  }
}
