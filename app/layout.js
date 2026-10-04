// Polices auto-hébergées (aucune requête vers Google au runtime → plus rapide, RGPD-friendly)
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/amiri/arabic-400.css';
import '@fontsource/amiri/arabic-700.css';
import '@fontsource/tajawal/arabic-400.css';
import '@fontsource/tajawal/arabic-500.css';
import '@fontsource/tajawal/arabic-700.css';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { SITE } from '@/lib/utils';
import { I18nProvider } from '@/context/I18nContext';
import { getI18n } from '@/lib/i18n/server';
import { HTML_LANG } from '@/lib/i18n/config';


export async function generateMetadata() {
  const { t, locale } = getI18n();
  return {
  metadataBase: new URL(SITE.url),
  title: {
    default: t('meta.title'),
    template: '%s · NADIA TIFAWT',
  },
  description: t('meta.description'),
  keywords: ['miel maroc', 'miel euphorbe', 'miel sidr', 'amlou', 'huile d’argan', 'cosmétique naturel maroc', 'miel agadir', 'amlou agadir', 'cosmétique naturel agadir', 'عسل حر', 'عسل الدغموس', 'أملو', 'زيت الأركان'],
  alternates: { canonical: '/', languages: { 'fr-MA': '/?lang=fr', 'ar-MA': '/?lang=ar', en: '/?lang=en' } },
  openGraph: {
    type: 'website', locale: { fr: 'fr_MA', ar: 'ar_MA', en: 'en_US' }[locale], alternateLocale: ['fr_MA', 'ar_MA', 'en_US'], siteName: 'NADIA TIFAWT',
    title: 'NADIA TIFAWT — Miel · Cosmétiques · Naturel', description: t('meta.ogDesc'),
    images: [{ url: '/images/logo-full.jpg', width: 1254, height: 1254, alt: 'NADIA TIFAWT' }],
  },
  twitter: { card: 'summary_large_image', images: ['/images/logo-full.jpg'] },
  icons: { icon: [{ url: '/favicon.ico' }, { url: '/icon-32.png', sizes: '32x32' }, { url: '/icon-192.png', sizes: '192x192' }], apple: '/icon-180.png' },
  manifest: '/manifest.webmanifest',
};
}

export const viewport = { themeColor: '#12291B' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'NADIA TIFAWT',
  slogan: 'Miel · Cosmétiques · Naturel',
  url: SITE.url,
  logo: `${SITE.url}/icon-512.png`,
  image: `${SITE.url}/images/logo-full.jpg`,
  telephone: '+212681325969',
  areaServed: 'MA',
  currenciesAccepted: 'MAD',
  paymentAccepted: 'Cash on delivery, Wafacash',
  address: { '@type': 'PostalAddress', addressLocality: 'Agadir', addressCountry: 'MA' },
};

export default function RootLayout({ children }) {
  const { locale, dir } = getI18n();
  return (
    <html lang={HTML_LANG[locale]} dir={dir}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <I18nProvider locale={locale}>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
