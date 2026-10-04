import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, createToken } from '@/lib/auth';
import { adminPassword } from '@/lib/admin-config';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (String(password || '').trim() !== adminPassword()) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createToken(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 12 });
  return res;
}
