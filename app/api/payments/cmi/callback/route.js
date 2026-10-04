import crypto from 'crypto';
import { getOrderByRef, updateOrder } from '@/lib/data';

// Callback serveur-à-serveur CMI : vérifie le HASH puis répond "ACTION=POSTAUTH".
export async function POST(req) {
  const form = Object.fromEntries((await req.formData()).entries());
  const keys = Object.keys(form).filter((k) => !['HASH', 'encoding'].includes(k)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const plain = keys.map((k) => String(form[k]).replace(/\\/g, '\\\\').replace(/\|/g, '\\|')).join('|') + '|' + (process.env.CMI_STORE_KEY || '');
  const hash = crypto.createHash('sha512').update(plain).digest('base64');
  if (hash !== form.HASH) return new Response('FAILURE', { status: 200 });

  const order = await getOrderByRef(form.oid);
  if (order && form.ProcReturnCode === '00') {
    await updateOrder(order._id, { paymentStatus: 'paid', status: 'confirmee' });
    return new Response('ACTION=POSTAUTH', { status: 200 });
  }
  return new Response('APPROVED', { status: 200 });
}
