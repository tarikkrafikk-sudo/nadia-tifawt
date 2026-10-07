export const formatMAD = (n) =>
  new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(n || 0) + ' DH';

export const cn = (...c) => c.filter(Boolean).join(' ');

export const SITE = {
  name: 'NADIA TIFAWT',
  slogan: 'Miel · Cosmétiques · Naturel',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  phone: '+212626829300',
  phoneDisplay: '06 26 82 93 00',
  phoneRaw: '212626829300',
  whatsapp: 'https://wa.me/212626829300',
  instagram: 'https://www.instagram.com/nadia_tifawte',
  tiktok: 'https://vm.tiktok.com/ZS9D4pLc3nhoh-NuKbE/',
  facebook: 'https://www.facebook.com/profile.php?id=61595068295249',
};

export function waLink(msg = '') {
  return `https://wa.me/212626829300?text=${encodeURIComponent(msg)}`;
}
