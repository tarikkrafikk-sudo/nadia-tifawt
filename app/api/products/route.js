import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET(req) {
  const sp = req.nextUrl.searchParams;
  const products = await getProducts({ category: sp.get('categorie') || undefined, sort: sp.get('tri') || undefined, q: sp.get('q') || undefined });
  return NextResponse.json({ products });
}
