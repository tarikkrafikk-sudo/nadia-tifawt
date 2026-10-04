// Normalise les données produit envoyées par l'admin
const FIELDS = ['name', 'nameAr', 'slug', 'category', 'size', 'shortDescription', 'description', 'ingredients', 'usage'];

export const slugify = (s = '') =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function sanitizeProduct(input = {}) {
  const out = {};
  for (const f of FIELDS) if (input[f] !== undefined) out[f] = String(input[f]).trim();
  if (out.name && !out.slug) out.slug = slugify(out.name);
  if (out.slug) out.slug = slugify(out.slug);
  for (const n of ['price', 'compareAtPrice', 'stock']) {
    if (input[n] !== undefined && input[n] !== '') out[n] = Math.max(0, Number(input[n]));
    else if (input[n] === '') out[n] = n === 'compareAtPrice' ? null : 0;
  }
  for (const b of ['bestseller', 'featured', 'active']) if (input[b] !== undefined) out[b] = Boolean(input[b]);
  if (input.i18n && typeof input.i18n === 'object') {
    out.i18n = {};
    for (const l of ['en', 'ar']) {
      out.i18n[l] = {};
      for (const k of ['name', 'shortDescription', 'description', 'ingredients', 'usage', 'size']) {
        const v = input.i18n?.[l]?.[k];
        if (v) out.i18n[l][k] = String(v).trim();
      }
    }
  }
  if (input.images !== undefined) out.images = (Array.isArray(input.images) ? input.images : String(input.images).split(/\n|,/)).map((s) => s.trim()).filter(Boolean);
  return out;
}
