import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/data';

export async function GET(req) {
  return NextResponse.json({ orders: await getOrders({ status: req.nextUrl.searchParams.get('status') || undefined }) });
}
