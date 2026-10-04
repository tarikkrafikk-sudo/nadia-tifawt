// Couche d'accès aux données : MongoDB si MONGODB_URI est défini,
// sinon un store "démo" sauvegardé dans data/demo-store.json (survit aux redémarrages).
import fs from 'fs';
import path from 'path';
import { connectDB, hasDB } from './db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Review from '@/models/Review';
import Setting from '@/models/Setting';
import { PRODUCTS, SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD } from './catalog';
import { isSampleReview } from './sample-reviews';

export const DEFAULT_SETTINGS = {
  onssa: {
    enabled: false,
    number: '', // N° d'autorisation / agrément sanitaire délivré par l'ONSSA à VOTRE établissement
    type: 'Autorisation sanitaire', // ou « Agrément sanitaire »
    holder: 'NADIA TIFAWT',
    activity: 'Conditionnement de miel et produits de la ruche',
    city: '',
    issuedAt: '',
    document: '', // URL de l'attestation (image ou PDF) — ex. /uploads/attestation-onssa.pdf
  },
  // Identifiants légaux de l'entreprise (affichés dans le pied de page et la page « Mentions légales »)
  company: {
    showInFooter: true,
    tradeName: 'NADIA TIFAWT',
    legalName: '', // nom du/de la titulaire de l'auto-entreprise
    status: 'Auto-entrepreneur',
    ice: '002457431000176',
    taxId: '67501830', // Identifiant fiscal (IF)
    tp: '67501830', // Taxe professionnelle
    aeNumber: 'AE-200224-875095', // N° du dossier d'inscription auto-entrepreneur
    rc: '',
    address: '',
    email: 'contact@nadiatifawt.ma',
    phone: '+212 6 81 32 59 69',
  },
};

/* ───────────── Store démo persistant ───────────── */
const STORE_FILE = path.join(process.cwd(), 'data', 'demo-store.json');
const now = () => new Date().toISOString();

function seedStore() {
  const st = {
    products: PRODUCTS.map((p, i) => ({ _id: `p${i + 1}`, active: true, ...p, rating: 0, reviewsCount: 0, createdAt: now() })),
    orders: [],
    reviews: [], // uniquement de vrais avis : déposés sur le site ou ajoutés depuis /admin/avis
    settings: DEFAULT_SETTINGS,
  };
  st.products.forEach((p) => recomputeMem(st, p.slug));
  return st;
}

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const st = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
      st.reviews ||= []; st.orders ||= [];
      // ajoute les traductions du catalogue aux produits d'un ancien fichier
      st.products.forEach((p) => { if (!p.i18n) p.i18n = PRODUCTS.find((x) => x.slug === p.slug)?.i18n || {}; }); st.settings = { ...DEFAULT_SETTINGS, ...(st.settings || {}) };
      return st;
    }
  } catch (e) { console.warn('[demo-store] lecture impossible, réinitialisation', e.message); }
  return seedStore();
}

const mem = globalThis._ntStore || (globalThis._ntStore = loadStore());

function persist() {
  if (hasDB) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(mem, null, 2));
  } catch (e) { console.warn('[demo-store] écriture impossible (hébergement en lecture seule ?)', e.message); }
}

function recomputeMem(st, slug) {
  const p = st.products.find((x) => x.slug === slug);
  if (!p) return;
  const ok = st.reviews.filter((r) => r.product === slug && r.status === 'approved');
  p.reviewsCount = ok.length;
  p.rating = ok.length ? Math.round((ok.reduce((a, r) => a + r.rating, 0) / ok.length) * 10) / 10 : 0;
}

const clean = (doc) => (doc ? JSON.parse(JSON.stringify({ ...doc, _id: String(doc._id) })) : null);

const SORTS = {
  featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
};

/* ───────────── Produits ───────────── */
export async function getProducts({ category, sort = 'featured', q, bestseller, includeInactive = false, maxPrice } = {}) {
  let list;
  if (hasDB) {
    await connectDB();
    const filter = includeInactive ? {} : { active: true };
    if (category) filter.category = category;
    if (bestseller) filter.bestseller = true;
    list = (await Product.find(filter).select('-reviews').lean()).map(clean);
  } else {
    list = mem.products.filter(
      (p) => (includeInactive || p.active) && (!category || p.category === category) && (!bestseller || p.bestseller)
    );
  }
  if (q) {
    const s = q.toLowerCase();
    list = list.filter((p) => [p.name, p.nameAr, p.shortDescription, p.i18n?.en?.name, p.i18n?.ar?.name].join(' ').toLowerCase().includes(s));
  }
  if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
  return [...list].sort(SORTS[sort] || SORTS.featured);
}

export async function getProductBySlug(slug) {
  if (hasDB) {
    await connectDB();
    return clean(await Product.findOne({ slug }).lean());
  }
  return clean(mem.products.find((p) => p.slug === slug));
}

export async function createProduct(data) {
  if (hasDB) {
    await connectDB();
    return clean((await Product.create(data)).toObject());
  }
  const p = { _id: `p${Date.now()}`, active: true, rating: 5, reviewsCount: 0, createdAt: new Date().toISOString(), ...data };
  mem.products.unshift(p);
  persist();
  return clean(p);
}

export async function updateProduct(id, data) {
  delete data.rating; delete data.reviewsCount;
  if (hasDB) {
    await connectDB();
    return clean(await Product.findByIdAndUpdate(id, data, { new: true }).lean());
  }
  const i = mem.products.findIndex((p) => p._id === id);
  if (i < 0) return null;
  mem.products[i] = { ...mem.products[i], ...data };
  persist();
  return clean(mem.products[i]);
}

export async function deleteProduct(id) {
  if (hasDB) {
    await connectDB();
    await Product.findByIdAndDelete(id);
    return true;
  }
  mem.products = mem.products.filter((p) => p._id !== id);
  persist();
  return true;
}

/* ───────────── Commandes ───────────── */
const makeRef = () => 'NT-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);

export async function createOrder({ customer, items, shippingZone, paymentMethod, locale }) {
  if (!customer?.fullName || !customer?.phone || !customer?.city || !customer?.address) throw new Error('Informations de livraison incomplètes.');
  if (!/^(\+212|0)[5-7]\d{8}$/.test(customer.phone.replace(/[\s.-]/g, ''))) throw new Error('Numéro de téléphone marocain invalide.');
  if (!Array.isArray(items) || !items.length) throw new Error('Votre panier est vide.');

  // Prix recalculés côté serveur (jamais confiance au client)
  const lines = [];
  for (const it of items) {
    const p = await getProductBySlug(it.slug);
    if (!p) throw new Error(`Produit introuvable : ${it.slug}`);
    const qty = Math.max(1, Math.min(20, parseInt(it.quantity, 10) || 1));
    if (p.stock < qty) throw new Error(`Stock insuffisant pour « ${p.name} ».`);
    lines.push({ product: hasDB ? p._id : undefined, slug: p.slug, name: p.name, image: p.images?.[0], price: p.price, quantity: qty });
  }
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const zone = SHIPPING_ZONES.find((z) => z.id === shippingZone) || SHIPPING_ZONES[SHIPPING_ZONES.length - 1];
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : zone.fee;
  const order = {
    reference: makeRef(), customer, items: lines, shippingZone: zone.id, subtotal, shippingFee,
    total: subtotal + shippingFee, paymentMethod: paymentMethod || 'cod', paymentStatus: 'pending', status: 'nouvelle',
    locale: ['fr', 'ar', 'en'].includes(locale) ? locale : 'fr',
  };

  // Décrémenter le stock
  for (const l of lines) {
    if (hasDB) {
      await connectDB();
      await Product.updateOne({ slug: l.slug }, { $inc: { stock: -l.quantity } });
    } else {
      const p = mem.products.find((x) => x.slug === l.slug);
      if (p) p.stock -= l.quantity;
    }
  }

  if (hasDB) return clean((await Order.create(order)).toObject());
  const o = { _id: `o${Date.now()}`, createdAt: new Date().toISOString(), ...order };
  mem.orders.unshift(o);
  persist();
  return clean(o);
}

export async function getOrders({ status } = {}) {
  if (hasDB) {
    await connectDB();
    return (await Order.find(status ? { status } : {}).sort({ createdAt: -1 }).limit(500).lean()).map(clean);
  }
  return mem.orders.filter((o) => !status || o.status === status).map(clean);
}

export async function getOrderByRef(reference) {
  if (hasDB) {
    await connectDB();
    return clean(await Order.findOne({ reference }).lean());
  }
  return clean(mem.orders.find((o) => o.reference === reference));
}

export async function updateOrder(id, data) {
  const allowed = {};
  if (data.status) allowed.status = data.status;
  if (data.paymentStatus) allowed.paymentStatus = data.paymentStatus;
  if (hasDB) {
    await connectDB();
    return clean(await Order.findByIdAndUpdate(id, allowed, { new: true }).lean());
  }
  const o = mem.orders.find((x) => x._id === id);
  if (!o) return null;
  Object.assign(o, allowed);
  persist();
  return clean(o);
}

export async function getStats() {
  const [orders, products] = await Promise.all([getOrders(), getProducts({ includeInactive: true })]);
  const valid = orders.filter((o) => o.status !== 'annulee');
  return {
    revenue: valid.reduce((s, o) => s + o.total, 0),
    ordersCount: orders.length,
    pending: orders.filter((o) => o.status === 'nouvelle').length,
    productsCount: products.length,
    lowStock: products.filter((p) => p.stock <= 5),
    pendingReviews: (await getReviews({ status: 'pending' })).length,
    mode: hasDB ? 'mongodb' : 'demo',
  };
}

/* ───────────── Avis clients ───────────── */
async function recomputeDB(slug) {
  const ok = await Review.find({ product: slug, status: 'approved' }).select('rating').lean();
  const rating = ok.length ? Math.round((ok.reduce((a, r) => a + r.rating, 0) / ok.length) * 10) / 10 : 0;
  await Product.updateOne({ slug }, { rating, reviewsCount: ok.length });
}

export async function getReviews({ status, product, featured, limit = 500 } = {}) {
  if (hasDB) {
    await connectDB();
    const f = {};
    if (status) f.status = status;
    if (product) f.product = product;
    if (featured) f.featured = true;
    return (await Review.find(f).sort({ createdAt: -1 }).limit(limit).lean()).map(clean);
  }
  return mem.reviews
    .filter((r) => (!status || r.status === status) && (!product || r.product === product) && (!featured || r.featured))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map(clean);
}

export async function createReview(input, { admin = false } = {}) {
  const rating = Math.round(Number(input.rating));
  const name = String(input.name || '').trim().slice(0, 60);
  const text = String(input.text || '').trim().slice(0, 1200);
  if (!name || !text || !(rating >= 1 && rating <= 5)) throw new Error('Nom, note (1 à 5) et commentaire sont requis.');
  if (text.length < 10) throw new Error('Votre avis est un peu court (10 caractères minimum).');
  const product = await getProductBySlug(input.product);
  if (!product) throw new Error('Produit introuvable.');
  const photos = (Array.isArray(input.photos) ? input.photos : [])
    .filter((u) => typeof u === 'string' && (admin ? /^(\/|https:\/\/)/.test(u) : /^\/api\/files\/avis-[\w-]+\.(jpg|png|webp)$/.test(u)))
    .slice(0, admin ? 6 : 3);
  // Achat vérifié : la référence correspond à une commande contenant ce produit
  const orderRef = String(input.orderRef || '').trim().toUpperCase().slice(0, 20);
  let verified = false;
  if (orderRef) {
    const order = await getOrderByRef(orderRef);
    verified = Boolean(order && order.status !== 'annulee' && order.items?.some((i) => i.slug === product.slug));
  }
  if (admin && input.verified !== undefined) verified = Boolean(input.verified);
  const doc = {
    product: product.slug, productName: product.name, name, city: String(input.city || '').trim().slice(0, 40), rating, text,
    status: admin ? input.status || 'approved' : 'pending', featured: admin ? Boolean(input.featured) : false,
    photos, verified, orderRef: orderRef || undefined,
    source: admin && ['site', 'whatsapp', 'instagram', 'boutique'].includes(input.source) ? input.source : 'site',
  };
  if (hasDB) {
    await connectDB();
    const r = await Review.create(doc);
    await recomputeDB(doc.product);
    return clean(r.toObject());
  }
  const r = { _id: `r${Date.now()}`, createdAt: now(), ...doc };
  mem.reviews.unshift(r);
  recomputeMem(mem, doc.product);
  persist();
  return clean(r);
}

export async function updateReview(id, data) {
  const allowed = {};
  for (const k of ['status', 'featured', 'name', 'city', 'text', 'reply', 'source']) if (data[k] !== undefined) allowed[k] = data[k];
  if (data.verified !== undefined) allowed.verified = Boolean(data.verified);
  if (data.orderRef !== undefined) allowed.orderRef = String(data.orderRef).trim().toUpperCase().slice(0, 20);
  if (Array.isArray(data.photos)) allowed.photos = data.photos.filter((u) => typeof u === 'string').slice(0, 6);
  if (data.rating !== undefined) allowed.rating = Math.max(1, Math.min(5, Math.round(Number(data.rating))));
  if (hasDB) {
    await connectDB();
    const r = await Review.findByIdAndUpdate(id, allowed, { new: true }).lean();
    if (r) await recomputeDB(r.product);
    return clean(r);
  }
  const r = mem.reviews.find((x) => x._id === id);
  if (!r) return null;
  Object.assign(r, allowed);
  recomputeMem(mem, r.product);
  persist();
  return clean(r);
}

export async function deleteReview(id) {
  if (hasDB) {
    await connectDB();
    const r = await Review.findByIdAndDelete(id).lean();
    if (r) await recomputeDB(r.product);
    return true;
  }
  const r = mem.reviews.find((x) => x._id === id);
  mem.reviews = mem.reviews.filter((x) => x._id !== id);
  if (r) recomputeMem(mem, r.product);
  persist();
  return true;
}

/* ───────────── Réglages (ONSSA…) ───────────── */
export async function getSettings() {
  if (hasDB) {
    await connectDB();
    const s = await Setting.findOne({ key: 'site' }).lean();
    return { ...DEFAULT_SETTINGS, ...(s?.data || {}), onssa: { ...DEFAULT_SETTINGS.onssa, ...(s?.data?.onssa || {}) }, company: { ...DEFAULT_SETTINGS.company, ...(s?.data?.company || {}) } };
  }
  return JSON.parse(JSON.stringify({ ...DEFAULT_SETTINGS, ...mem.settings, onssa: { ...DEFAULT_SETTINGS.onssa, ...(mem.settings?.onssa || {}) }, company: { ...DEFAULT_SETTINGS.company, ...(mem.settings?.company || {}) } }));
}

export async function updateSettings(patch) {
  const cur = await getSettings();
  const next = { ...cur, ...patch, onssa: { ...cur.onssa, ...(patch.onssa || {}) }, company: { ...cur.company, ...(patch.company || {}) } };
  if (hasDB) {
    await connectDB();
    await Setting.updateOne({ key: 'site' }, { data: next }, { upsert: true });
  } else {
    mem.settings = next;
    persist();
  }
  return next;
}

/** Supprime les anciens avis d'exemple de la démo (gardés dans d'anciennes bases). */
export async function deleteSampleReviews() {
  const all = await getReviews();
  const samples = all.filter(isSampleReview);
  for (const r of samples) await deleteReview(r._id);
  return samples.length;
}
