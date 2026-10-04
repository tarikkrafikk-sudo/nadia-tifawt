import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyToken } from '@/lib/auth';

const LOCALES = ['fr', 'ar', 'en'];

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  /* ── Admin protégé ── */
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const isLogin = pathname === '/admin/login' || pathname === '/api/admin/login';
    if (!isLogin && !(await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
      if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
    // l'administration reste en français (LTR)
    const h = new Headers(req.headers);
    h.set('x-locale', 'fr');
    return NextResponse.next({ request: { headers: h } });
  }

  /* ── Langue : ?lang=ar|en|fr > cookie > navigateur ── */
  const param = searchParams.get('lang');
  let locale = LOCALES.includes(param) ? param : req.cookies.get('lang')?.value;
  if (!LOCALES.includes(locale)) {
    const al = (req.headers.get('accept-language') || '').toLowerCase();
    locale = al.startsWith('ar') ? 'ar' : al.startsWith('en') ? 'en' : 'fr';
  }
  const headers = new Headers(req.headers);
  headers.set('x-locale', locale);
  const res = NextResponse.next({ request: { headers } });
  if (req.cookies.get('lang')?.value !== locale) res.cookies.set('lang', locale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|images|favicon.ico|icon-|manifest|robots.txt|sitemap.xml|api/files).*)'] };
