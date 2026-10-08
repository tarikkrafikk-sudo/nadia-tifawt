import { SITE } from '@/lib/utils';
import { getProducts } from '@/lib/data';
export default async function sitemap() {
  const products = await getProducts();
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/boutique`, lastModified: now, priority: 0.9 },
    { url: `${SITE.url}/qualite`, lastModified: now, priority: 0.4 },
    { url: `${SITE.url}/notre-histoire`, lastModified: now, priority: 0.5 },
    { url: `${SITE.url}/mentions-legales`, lastModified: now, priority: 0.2 },
    ...['zoyout', 'amlou', 'miel', 'tbrima'].map((c) => ({ url: `${SITE.url}/boutique?categorie=${c}`, lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE.url}/produit/${p.slug}`, lastModified: now, priority: 0.7 })),
  ];
}
