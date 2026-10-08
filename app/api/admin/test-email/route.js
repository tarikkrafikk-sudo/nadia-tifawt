// Test Resend : ouvrir /api/admin/test-email (après connexion à /admin).
// Utilise l'API HTTP de Resend directement (pas besoin du paquet npm « resend » → le build ne peut pas casser).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const resendKey = (process.env.RESEND_API_KEY || '').trim();
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
    const fromEmail = (process.env.EMAIL_FROM || 'onboarding@resend.dev').trim();
    if (!resendKey) return Response.json({ error: 'RESEND_API_KEY manquant' }, { status: 500 });
    if (!adminEmail) return Response.json({ error: 'ADMIN_EMAIL manquant' }, { status: 500 });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail.split(',').map((s) => s.trim()).filter(Boolean),
        subject: 'Test Nadia Tifawt',
        html: `<p>Test email - ADMIN: ${adminEmail} FROM: ${fromEmail}</p>`,
      }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) return Response.json({ error: result, admin_email: adminEmail, from_email: fromEmail }, { status: 400 });
    return Response.json({ status: 'ok', verdict: 'Resend a accepté', resend_response: result, admin_email: adminEmail, from_email: fromEmail });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
