import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteSampleReviews, getReviews } from '@/lib/data';
import { isSampleReview } from '@/lib/sample-reviews';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ count: (await getReviews()).filter(isSampleReview).length });
}

export async function DELETE() {
  const deleted = await deleteSampleReviews();
  revalidatePath('/', 'layout');
  return NextResponse.json({ deleted });
}
