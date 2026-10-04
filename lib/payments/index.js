// Passerelles de paiement — prêtes à être branchées.
// COD est actif. MoPay / CMI / Wafacash : remplissez les clés dans .env.local
// puis complétez les appels marqués TODO selon la documentation de votre fournisseur.
import crypto from 'crypto';

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Paiement à la livraison', description: 'Payez en espèces à la réception de votre colis.', enabled: true },
  { id: 'wafacash', label: 'Wafacash', description: 'Transfert Wafacash — nous vous envoyons les coordonnées par WhatsApp.', enabled: true },
  { id: 'mopay', label: 'MoPay', description: 'Paiement mobile sécurisé.', enabled: Boolean(process.env.MOPAY_API_KEY) },
  { id: 'cmi', label: 'Carte bancaire (CMI)', description: 'Visa, Mastercard, cartes marocaines.', enabled: Boolean(process.env.CMI_CLIENT_ID) },
];

/** MoPay — crée une intention de paiement et renvoie l'URL de redirection. */
export async function createMoPayPayment(order) {
  const { MOPAY_API_KEY, MOPAY_MERCHANT_ID, MOPAY_API_URL } = process.env;
  if (!MOPAY_API_KEY) return { ok: false, reason: 'MOPAY_API_KEY manquant (placeholder).' };
  // TODO: adapter au contrat d'API MoPay
  const res = await fetch(`${MOPAY_API_URL}/payments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MOPAY_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: MOPAY_MERCHANT_ID,
      amount: order.total,
      currency: 'MAD',
      reference: order.reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/mopay/callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/commande/${order.reference}`,
    }),
  });
  const data = await res.json();
  return { ok: res.ok, redirectUrl: data.paymentUrl, raw: data };
}

/** CMI — construit les champs du formulaire 3D Secure (hash SHA-512, version 3). */
export function buildCmiForm(order) {
  const { CMI_CLIENT_ID, CMI_STORE_KEY, CMI_GATEWAY_URL, NEXT_PUBLIC_SITE_URL } = process.env;
  if (!CMI_CLIENT_ID) return { ok: false, reason: 'CMI_CLIENT_ID manquant (placeholder).' };
  const fields = {
    clientid: CMI_CLIENT_ID, amount: order.total.toFixed(2), currency: '504', oid: order.reference,
    okUrl: `${NEXT_PUBLIC_SITE_URL}/commande/${order.reference}`, failUrl: `${NEXT_PUBLIC_SITE_URL}/checkout?error=cmi`,
    callbackUrl: `${NEXT_PUBLIC_SITE_URL}/api/payments/cmi/callback`, TranType: 'PreAuth', storetype: '3D_PAY_HOSTING',
    hashAlgorithm: 'ver3', lang: 'fr', rnd: String(Date.now()), encoding: 'UTF-8',
    BillToName: order.customer.fullName, tel: order.customer.phone, email: order.customer.email || '',
  };
  const keys = Object.keys(fields).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const plain = keys.map((k) => String(fields[k]).replace(/\\/g, '\\\\').replace(/\|/g, '\\|')).join('|') + '|' + CMI_STORE_KEY;
  fields.HASH = crypto.createHash('sha512').update(plain).digest('base64');
  return { ok: true, action: CMI_GATEWAY_URL, fields };
}
