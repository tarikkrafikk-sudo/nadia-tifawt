import { NextResponse } from 'next/server';
import { updateOrder } from '@/lib/data';

export async function PATCH(req, { params }) {
  const order = await updateOrder(params.id, await req.json());
  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
  return NextResponse.json({ order });
}
