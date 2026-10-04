import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getReviews, createReview } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const status = req.nextUrl.searchParams.get('status') || undefined;
  return NextResponse.json({ reviews: await getReviews({ status }) });
}

export async function POST(req) {
  try {
    const review = await createReview(await req.json(), { admin: true });
    revalidatePath('/', 'layout');
    return NextResponse.json({ review }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
