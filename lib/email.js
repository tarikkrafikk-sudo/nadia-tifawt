import { SITE, formatMAD } from './utils';
import { SHIPPING_ZONES } from './catalog';

const RESEND_URL = process.env.RESEND_API_URL || 'https://api.resend.com/emails';
const GOLD = '#D4AF37', GOLD_SOFT = '#E2C77E', GREEN = '#0A2A1A', GREEN_2 = '#12291B', CREAM = '#F5F1E8';

const esc = (v) => String(v?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FALLBACK_URL = 'https://nadia-tifawt.onrender.com';
const siteUrl = () => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || SITE.url || '';
  if (!raw || raw.includes('localhost') || raw.includes('127.0.0.1')) return FALLBACK_URL;
  return raw.replace(/\/$/, '');
};
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const absUrl = (u) => { if (!u) return ''; if (/^https?:/.test(u)) return u; return siteUrl() + (u.startsWith('/')? u : '/' + u); };

const T = {
  fr: {
    subject: (r) => `Merci! Votre commande ${r} est confirmée — NADIA TIFAWT`,
    preheader: 'Merci pour votre confiance. Voici le récapitulatif de votre commande.',
    hello: (n) => `Bonjour ${n},`,
    title: 'Merci, votre commande est confirmée',
    intro: 'Nous avons bien reçu votre commande. Notre équipe vous appelle sous 2 h pour confirmer la livraison.',
    ref: 'Commande', date: 'Date', product: 'Produit', qty: 'Qté', subtotal: 'Sous-total', shipping: 'Livraison', free: 'Offerte', total: 'Total',
    delivery: 'Livraison', payment: 'Paiement', delay: 'Délai estimé',
    pay: { cod: 'Paiement à la livraison (espèces)', wafacash: 'Wafacash', mopay: 'MoPay', cmi: 'Carte bancaire (CMI)' },
    wafa: 'Vous avez choisi Wafacash : nous vous envoyons les coordonnées du transfert par WhatsApp.',
    track: 'Voir ma commande', help: 'Une question? Écrivez-nous sur WhatsApp :', thanks: 'Avec toute notre gratitude,', team: 'L’équipe NADIA TIFAWT',
  },
  en: {
    subject: (r) => `Thank you! Your order ${r} is confirmed — NADIA TIFAWT`,
    preheader: 'Thank you for your trust. Here is your order summary.',
    hello: (n) => `Hello ${n},`,
    title: 'Thank you, your order is confirmed',
    intro: 'We have received your order. Our team will call you within 2 hours to confirm delivery.',
    ref: 'Order', date: 'Date', product: 'Product', qty: 'Qty', subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free', total: 'Total',
    delivery: 'Delivery', payment: 'Payment', delay: 'Estimated time',
    pay: { cod: 'Cash on delivery', wafacash: 'Wafacash', mopay: 'MoPay', cmi: 'Credit card (CMI)' },
    wafa: 'You chose Wafacash: we will send you the transfer details on WhatsApp.',
    track: 'View my order', help: 'A question? Message us on WhatsApp:', thanks: 'With all our gratitude,', team: 'The NADIA TIFAWT team',
  },
  ar: {
    subject: (r) => `شكرًا لك! تم تأكيد طلبك ${r} — NADIA TIFAWT`,
    preheader: 'شكرًا على ثقتك. إليك ملخص طلبك.',
    hello: (n) => `مرحبًا ${n}،`,
    title: 'شكرًا لك، تم تأكيد طلبك',
    intro: 'لقد توصلنا بطلبك. سيتصل بك فريقنا خلال ساعتين لتأكيد التوصيل.',
    ref: 'الطلب', date: 'التاريخ', product: 'المنتج', qty: 'الكمية', subtotal: 'المجموع الفرعي', shipping: 'التوصيل', free: 'مجاني', total: 'المجموع',
    delivery: 'التوصيل', payment: 'الدفع', delay: 'المدة المتوقعة',
    pay: { cod: 'الدفع عند الاستلام', wafacash: 'وفاكاش', mopay: 'MoPay', cmi: 'بطاقة بنكية (CMI)' },
    wafa: 'اخترت وفاكاش: سنرسل لك معلومات التحويل عبر واتساب.',
    track: 'عرض طلبي', help: 'لديك سؤال؟ راسلنا عبر واتساب:', thanks: 'مع خالص الامتنان،', team: 'فريق NADIA TIFAWT',
  },
};

function layout({ dir = 'ltr', lang = 'fr', preheader = '', body }) {
  const logo = `${siteUrl()}/images/emblem.png`;
  const align = dir === 'rtl'? 'right' : 'left';
  return `<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NADIA TIFAWT</title></head><body style="margin:0;padding:0;background:${GREEN};"><span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${esc(preheader)}</span><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${GREEN};"><tr><td align="center" style="padding:32px 12px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${GREEN_2};border:1px solid #8F6F1F;border-radius:18px;"><tr><td align="center" style="padding:36px 24px 8px;"><img src="${logo}" width="88" height="88" alt="NADIA TIFAWT" style="display:block;width:88px;height:88px;border-radius:50%;border:2px solid ${GOLD};background:${GREEN};"><div style="margin-top:14px;font-family:Georgia,serif;font-size:30px;letter-spacing:6px;color:${GOLD};">NADIA</div><div style="font-family:Georgia,serif;font-size:13px;letter-spacing:9px;color:${GOLD_SOFT};">TIFAWT</div><div style="margin-top:10px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:4px;color:#C5A059;">MIEL &#9670; COSMÉTIQUES &#9670; NATUREL</div><div style="margin:18px auto 0;width:160px;height:1px;background:${GOLD};line-height:1px;font-size:1px;">&nbsp;</div></td></tr><tr><td dir="${dir}" style="padding:20px 32px 8px;text-align:${align};font-family:Arial,sans-serif;color:${CREAM};font-size:15px;line-height:1.6;">${body}</td></tr><tr><td align="center" style="padding:24px 32px 32px;font-family:Arial,sans-serif;font-size:11px;line-height:1.7;color:#9DB2A5;"><div style="margin:0 auto 14px;width:60px;height:1px;background:#8F6F1F;line-height:1px;font-size:1px;">&nbsp;</div>NADIA TIFAWT · Agadir, Maroc · <a href="${siteUrl()}" style="color:${GOLD_SOFT};text-decoration:none;">${esc(siteUrl().replace(/^https?:\/\//, ''))}</a><br>WhatsApp ${esc(SITE.phoneDisplay)}</td></tr></table></td></tr></table></body></html>`;
}

function itemsTable(order, t, dir, lang = 'fr') {
  const m = (n) => money(n, lang);
  const end = dir === 'rtl'? 'left' : 'right', start = dir === 'rtl'? 'right' : 'left';
  const rows = order.items.map((l) => `<tr><td style="padding:12px 0;border-bottom:1px solid #234F33;text-align:${start};"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${l.image? `<td style="padding-${dir === 'rtl'? 'left' : 'right'}:12px;"><img src="${absUrl(l.image)}" width="52" height="52" alt="" style="display:block;width:52px;height:52px;border-radius:10px;object-fit:cover;border:1px solid #8F6F1F;"></td>` : ''}<td style="font-family:Georgia,serif;font-size:16px;color:${CREAM};">${esc(l.name)}<br><span style="font-family:Arial,sans-serif;font-size:12px;color:#9DB2A5;">${t.qty} : ${l.quantity} × ${m(l.price)}</span></td></tr></table></td><td style="padding:12px 0;border-bottom:1px solid #234F33;text-align:${end};white-space:nowrap;font-weight:bold;color:${GOLD_SOFT};">${m(l.price * l.quantity)}</td></tr>`).join('');
  const line = (label, value, strong) => `<tr><td style="padding:6px 0;text-align:${start};color:${strong? CREAM : '#9DB2A5'};font-size:${strong? 17 : 14}px;${strong? 'font-weight:bold;' : ''}">${label}</td><td style="padding:6px 0;text-align:${end};white-space:nowrap;color:${strong? GOLD : CREAM};font-size:${strong? 22 : 14}px;${strong? 'font-family:Georgia,serif;font-weight:bold;' : ''}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">${rows}${line(t.subtotal, m(order.subtotal))}${line(t.shipping, order.shippingFee? m(order.shippingFee) : t.free)}<tr><td colspan="2" style="height:1px;background:#8F6F1F;line-height:1px;font-size:1px;">&nbsp;</td></tr>${line(t.total, m(order.total), true)}</table>`;
}

const money = (n, lang) => (lang === 'ar'? formatMAD(n).replace(/\s?DH$/, ' درهم') : formatMAD(n));
const ltr = (v) => `<span dir="ltr" style="unicode-bidi:isolate;">${v}</span>`;
const fmtDate = (d, locale) => new Date(d || Date.now()).toLocaleString(locale === 'ar'? 'ar-MA' : locale === 'en'? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Casablanca' });

export function customerEmail(order) {
  const lang = T[order.locale]? order.locale : 'fr';
  const t = T[lang], dir = lang === 'ar'? 'rtl' : 'ltr';
  const c = order.customer, zone = SHIPPING_ZONES.find((z) => z.id === order.shippingZone);
  const box = (label, html) => `<td valign="top" style="padding:14px 16px;background:#0F2418;border:1px solid #234F33;border-radius:12px;"><div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C5A059;">${label}</div><div style="margin-top:6px;font-size:14px;line-height:1.6;color:${CREAM};">${html}</div></td>`;
  const body = `<p style="margin:0;color:#C5D3CA;">${esc(t.hello(c.fullName))}</p><h1 style="margin:10px 0 6px;font-family:Georgia,serif;font-weight:normal;font-size:28px;line-height:1.25;color:${GOLD};">${t.title}</h1><p style="margin:0 0 18px;color:#C5D3CA;">${t.intro}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${GREEN};border:1px solid ${GOLD};border-radius:14px;"><tr><td style="padding:16px 18px;"><span style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C5A059;">${t.ref}</span><br><span dir="ltr" style="font-family:'Courier New',monospace;font-size:20px;letter-spacing:1px;color:${GOLD};font-weight:bold;white-space:nowrap;">#${esc(order.reference)}</span></td><td style="padding:16px 18px;text-align:${dir === 'rtl'? 'left' : 'right'};font-size:12px;color:#9DB2A5;">${t.date}<br><span style="color:${CREAM};">${esc(fmtDate(order.createdAt, lang))}</span></td></tr></table>${itemsTable(order, t, dir, lang)}<table role="presentation" width="100%" cellpadding="0" cellspacing="8" border="0" style="margin-top:18px;"><tr>${box(t.delivery, `${esc(c.fullName)}<br>${esc(c.address)}<br>${esc(c.city)}<br><span dir="ltr">${esc(c.phone)}</span>${zone? `<br><span style="color:#9DB2A5;">${t.delay} : ${ltr(esc(zone.delay))}</span>` : ''}`)}${box(t.payment, esc(t.pay[order.paymentMethod] || order.paymentMethod))}</tr></table>${order.paymentMethod === 'wafacash'? `<p style="margin:16px 0 0;padding:12px 16px;border-${dir === 'rtl'? 'right' : 'left'}:3px solid ${GOLD};background:#0F2418;color:${CREAM};font-size:14px;">${t.wafa}</p>` : ''}<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 8px;"><tr><td style="border-radius:999px;background:${GOLD};"><a href="${siteUrl()}/commande/${encodeURIComponent(order.reference)}" style="display:inline-block;padding:14px 30px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${GREEN};text-decoration:none;">${t.track}</a></td></tr></table><p style="margin:22px 0 0;font-size:13px;color:#9DB2A5;">${t.help} <a href="https://wa.me/${SITE.whatsapp}" dir="ltr" style="color:${GOLD_SOFT};unicode-bidi:isolate;">${esc(SITE.phoneDisplay)}</a></p><p style="margin:18px 0 0;color:#C5D3CA;">${t.thanks}<br><span style="font-family:Georgia,serif;font-size:17px;color:${GOLD};">${t.team}</span></p>`;
  const text = [t.hello(c.fullName), '', t.title, t.intro, '', `${t.ref} #${order.reference}`,...order.items.map((l) => `- ${l.name} × ${l.quantity} : ${money(l.price * l.quantity, lang)}`), `${t.shipping} : ${order.shippingFee? money(order.shippingFee, lang) : t.free}`, `${t.total} : ${money(order.total, lang)}`, '', `${t.payment} : ${t.pay[order.paymentMethod] || order.paymentMethod}`, `${siteUrl()}/commande/${order.reference}`, '', t.team].join('\n');
  return { subject: t.subject('#' + order.reference), html: layout({ dir, lang, preheader: t.preheader, body }), text };
}

export function adminEmail(order) {
  const c = order.customer, t = T.fr, zone = SHIPPING_ZONES.find((z) => z.id === order.shippingZone);
  const row = (k, v) => `<tr><td style="padding:5px 0;width:120px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C5A059;vertical-align:top;">${k}</td><td style="padding:5px 0;font-size:15px;color:${CREAM};">${v}</td></tr>`;
  const phone = String(c.phone || '').replace(/[^\d+]/g, '');
  const waPhone = phone.startsWith('0')? '212' + phone.slice(1) : phone.replace('+', '');
  const body = `<h1 style="margin:0 0 4px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:${GOLD};">Nouvelle commande</h1><p style="margin:0 0 16px;font-family:'Courier New',monospace;font-size:19px;letter-spacing:1px;color:${GOLD_SOFT};white-space:nowrap;">#${esc(order.reference)} · ${formatMAD(order.total)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${row('Client', esc(c.fullName))}${row('Téléphone', `<a href="tel:${esc(phone)}" style="color:${GOLD_SOFT};">${esc(c.phone)}</a>`)}${c.email? row('E-mail', `<a href="mailto:${esc(c.email)}" style="color:${GOLD_SOFT};">${esc(c.email)}</a>`) : ''}${row('Adresse', `${esc(c.address)}, ${esc(c.city)}`)}${row('Zone', esc(zone? `${zone.label} (${zone.delay})` : order.shippingZone))}${row('Paiement', esc(t.pay[order.paymentMethod] || order.paymentMethod))}${c.notes? row('Note', esc(c.notes)) : ''}${row('Langue', esc((order.locale || 'fr').toUpperCase()))}</table>${itemsTable(order, t, 'ltr')}<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;"><tr><td style="border-radius:999px;background:${GOLD};"><a href="${siteUrl()}/admin/commandes" style="display:inline-block;padding:12px 24px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${GREEN};text-decoration:none;">Ouvrir l’admin</a></td><td style="width:10px;"></td><td style="border-radius:999px;background:#1f8a45;"><a href="https://wa.me/${esc(waPhone)}" style="display:inline-block;padding:12px 24px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#fff;text-decoration:none;">WhatsApp client</a></td></tr></table>`;
  const text = [`Nouvelle commande #${order.reference} — ${formatMAD(order.total)}`, `${c.fullName} · ${c.phone}${c.email? ' · ' + c.email : ''}`, `${c.address}, ${c.city}`,...order.items.map((l) => `- ${l.name} × ${l.quantity}`), `${siteUrl()}/admin/commandes`].join('\n');
  return { subject: `Nouvelle commande #${order.reference} — ${formatMAD(order.total)} — ${c.fullName}`, html: layout({ preheader: `${c.fullName} · ${c.city} · ${formatMAD(order.total)}`, body }), text };
}

async function send({ to, subject, html, text, replyTo, idempotencyKey }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn('[email] RESEND_API_KEY absent : e-mail non envoyé →', subject); return { skipped: true }; }
  const from = process.env.EMAIL_FROM || 'NADIA TIFAWT <onboarding@resend.dev>';
  const res = await fetch(RESEND_URL, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json',...(idempotencyKey? { 'Idempotency-Key': idempotencyKey } : {}) }, body: JSON.stringify({ from, to: Array.isArray(to)? to : [to], subject, html, text,...(replyTo? { reply_to: replyTo } : {}) }), signal: AbortSignal.timeout(10000), });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status} : ${data.message || data.error || 'erreur inconnue'}`);
  return { id: data.id };
}

export async function sendOrderEmails(order) {
  const jobs = [];
  const customerTo = order.customer?.email?.trim();
  if (isEmail(customerTo)) { jobs.push(['client', send({ to: customerTo, replyTo: process.env.ADMIN_EMAIL?.split(',')[0]?.trim(), idempotencyKey: `order-${order.reference}-client`,...customerEmail(order) })]); }
  const admins = (process.env.ADMIN_EMAIL || '').split(',').map((s) => s.trim()).filter(isEmail);
  if (admins.length) { jobs.push(['admin', send({ to: admins, replyTo: isEmail(customerTo)? customerTo : undefined, idempotencyKey: `order-${order.reference}-admin`,...adminEmail(order) })]); }
  const results = await Promise.allSettled(jobs.map(([, p]) => p));
  const report = {};
  results.forEach((r, i) => { const who = jobs[i][0]; if (r.status === 'rejected') console.error(`[email] échec envoi ${who} (${order.reference}) :`, r.reason?.message || r.reason); report[who] = r.status === 'fulfilled'? (r.value.skipped? 'skipped' : 'sent') : 'failed'; });
  return report;
}
