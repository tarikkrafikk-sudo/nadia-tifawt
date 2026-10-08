import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/data';
import { createMoPayPayment, buildCmiForm, PAYMENT_METHODS } from '@/lib/payments';
import { sendOrderEmails } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const method = PAYMENT_METHODS.find((m) => m.id === body.paymentMethod && m.enabled);
    if (!method) return NextResponse.json({ error: 'Mode de paiement indisponible.' }, { status: 400 });

    const order = await createOrder(body); // commande enregistrée (MongoDB ou store démo)

    // E-mails : confirmation client (si e-mail fourni) + alerte admin, via Resend.
    // Attendu avant de répondre (sinon l'hébergeur peut couper l'envoi), mais ne bloque jamais la commande.
    const emails = await sendOrderEmails(order).catch((e) => { console.error('[email]', e); return null; });

    let payment = null;
    if (order.paymentMethod === 'mopay') payment = await createMoPayPayment(order);
    if (order.paymentMethod === 'cmi') payment = buildCmiForm(order);

    return NextResponse.json({ order: { reference: order.reference, total: order.total }, payment, emails }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 400 });
  }
}
