export const formatMAD = (n) =>
  new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(n || 0) + ' DH';

export const cn = (...c) => c.filter(Boolean).join(' ');

export const SITE = {
  name: 'NADIA TIFAWT',
  slogan: 'Miel · Cosmétiques · Naturel',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '212681325969',
  phoneDisplay: '+212 6 81 32 59 69',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || 'https://instagram.com/',
};

export const waLink = (text = '') =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
