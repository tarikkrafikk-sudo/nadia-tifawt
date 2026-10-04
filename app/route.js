import { NextResponse } from 'next/server';
import { connectDB, hasDB } from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { PRODUCTS } from '@/lib/catalog';

// Importe le catalogue dans MongoDB (aucun avis inventé : les avis viennent des clients).
export async function POST() {
  if (!hasDB) return NextResponse.json({ error: 'MONGODB_URI non défini — mode démo.' }, { status: 400 });
  await connectDB();
  await Product.bulkWrite(PRODUCTS.map(({ rating, reviewsCount, ...p }) => ({ updateOne: { filter: { slug: p.slug }, update: { $setOnInsert: p }, upsert: true } })));
  for (const p of PRODUCTS) {
    const ok = await Review.find({ product: p.slug, status: 'approved' }).lean();
    await Product.updateOne({ slug: p.slug }, { reviewsCount: ok.length, rating: ok.length ? Math.round((ok.reduce((a, r) => a + r.rating, 0) / ok.length) * 10) / 10 : 0 });
  }
  return NextResponse.json({ ok: true, count: PRODUCTS.length });
}
