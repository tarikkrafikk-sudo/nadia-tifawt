import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProducts, createProduct } from '@/lib/data';
import { sanitizeProduct } from '@/lib/admin';

export async function GET() {
  return NextResponse.json({ products: await getProducts({ includeInactive: true, sort: 'newest' }) });
}

export async function POST(req) {
  try {
    const data = sanitizeProduct(await req.json());
    if (!data.name || !data.slug || !data.category || data.price == null) throw new Error('Nom, slug, catégorie et prix sont requis.');
    const product = await createProduct(data);
    revalidatePath('/', 'layout');
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
