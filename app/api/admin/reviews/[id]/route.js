import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateReview, deleteReview } from '@/lib/data';

export async function PATCH(req, { params }) {
  const review = await updateReview(params.id, await req.json());
  if (!review) return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ review });
}

export async function DELETE(_req, { params }) {
  await deleteReview(params.id);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
