import { Instagram } from 'lucide-react';
import { SectionTitle } from '@/components/ui/Ornament';
import { getI18n } from '@/lib/i18n/server';

const LINKS = {
  instagram: 'https://www.instagram.com/nadia_tifawte?stkn=cGo0aWpodmF4dWU3/',
  facebook: 'https://www.facebook.com/profile.php?id=61595068295249',
  tiktok: 'https://vm.tiktok.com/ZS9D4pLc3nhoh-NuKbE/',
};

/* ───────── Logos (SVG inline, aucune image à charger) ───────── */
function InstagramLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad" cx="0.3" cy="1.07" r="1.3">
          <stop offset="0" stopColor="#FFDD55" />
          <stop offset="0.1" stopColor="#FFDD55" />
          <stop offset="0.5" stopColor="#FF543E" />
          <stop offset="1" stopColor="#C837AB" />
        </radialGradient>
        <radialGradient id="ig-grad2" cx="-0.1" cy="0.05" r="0.6">
          <stop offset="0" stopColor="#3771C8" />
          <stop offset="0.13" stopColor="#3771C8" />
          <stop offset="1" stopColor="#6600FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect width="24" height="24" rx="6" fill="url(#ig-grad2)" />
      <rect x="5" y="5" width="14" height="14" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="16.3" cy="7.7" r="1.05" fill="#fff" />
    </svg>
  );
}

function FacebookLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <clipPath id="fb-clip"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path clipPath="url(#fb-clip)" fill="#fff"
        d="M16.7 15.47l.53-3.47h-3.33V9.75c0-.95.47-1.88 1.95-1.88h1.51V4.92s-1.37-.23-2.69-.23c-2.74 0-4.53 1.66-4.53 4.67V12H7.1v3.47h3.04V24h3.76v-8.53h2.8z" />
    </svg>
  );
}

const TIKTOK_NOTE =
  'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';

function TikTokLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#000" />
      <g transform="translate(5.2 4.6) scale(0.56)">
        <path d={TIKTOK_NOTE} fill="#25F4EE" transform="translate(-1 -1)" />
        <path d={TIKTOK_NOTE} fill="#FE2C55" transform="translate(1 1)" />
        <path d={TIKTOK_NOTE} fill="#fff" />
      </g>
    </svg>
  );
}

const SOCIALS = [
  { key: 'instagram', name: 'Instagram', handle: '@nadia.tifawt', href: LINKS.instagram, Logo: InstagramLogo },
  { key: 'facebook', name: 'Facebook', handle: 'Nadia Tifawt', href: LINKS.facebook, Logo: FacebookLogo },
  { key: 'tiktok', name: 'TikTok', handle: '@nadiatifawt', href: LINKS.tiktok, Logo: TikTokLogo },
];

export default function InstagramFeed() {
  const { t } = getI18n();
  return (
    <section className="py-24">
      <div className="container">
        <SectionTitle eyebrow="@nadiatifawt" title={t('insta.title')} subtitle={t('insta.subtitle')} />
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4">
          {SOCIALS.map(({ key, name, handle, href, Logo }) => (
            <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} — ${handle}`}
              className="group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-gold-500/15 bg-forest-radial p-3 text-center transition duration-500 hover:border-gold-400 hover:shadow-gold sm:gap-3">
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,.18),transparent_60%)] opacity-60 transition duration-500 group-hover:opacity-100" />
              <Logo className="relative h-12 w-12 drop-shadow-lg transition duration-700 group-hover:scale-110 sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
              <span className="relative">
                <span className="block font-serif text-base text-gold-100 sm:text-xl">{name}</span>
                <span className="block text-[10px] tracking-wide text-gold-300/80 sm:text-xs">{handle}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline"><Instagram className="h-4 w-4" /> {t('insta.follow')}</a>
        </div>
      </div>
    </section>
  );
}
