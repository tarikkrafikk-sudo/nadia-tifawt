import { NextResponse } from 'next/server';
import { getOrderByRef, updateOrder } from '@/lib/data';

// Webhook MoPay — TODO : vérifier la signature selon la doc MoPay (header + MOPAY_API_KEY).
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const order = await getOrderByRef(body.reference);
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await updateOrder(order._id, { paymentStatus: body.status === 'SUCCESS' ? 'paid' : 'failed' });
  return NextResponse.json({ ok: true });
}
