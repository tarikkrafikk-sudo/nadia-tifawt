import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateProduct, deleteProduct } from '@/lib/data';
import { sanitizeProduct } from '@/lib/admin';

export async function PATCH(req, { params }) {
  const product = await updateProduct(params.id, sanitizeProduct(await req.json()));
  if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ product });
}

export async function DELETE(_req, { params }) {
  await deleteProduct(params.id);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
