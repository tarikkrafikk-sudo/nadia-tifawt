import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { SectionTitle } from '@/components/ui/Ornament';
import { SITE } from '@/lib/utils';
import { getI18n } from '@/lib/i18n/server';

// Grille statique — à remplacer par l'API Instagram Basic Display / Graph
// (voir README : INSTAGRAM_ACCESS_TOKEN) une fois le compte relié.
const POSTS = ['miel-euphorbe', 'creme-visage-miel', 'amlou-traditionnel', 'huile-argan', 'miel-sidr', 'savon-noir'];

export default function InstagramFeed() {
  const { t } = getI18n();
  return (
    <section className="py-24">
      <div className="container">
        <SectionTitle eyebrow="@nadiatifawt" title={t('insta.title')} subtitle={t('insta.subtitle')} />
        <div className="mt-14 grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
          {POSTS.map((p) => (
            <a key={p} href={SITE.instagram} target="_blank" rel="noopener" aria-label={t('insta.view')}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gold-500/15">
              <Image src={`/images/products/${p}.jpg`} alt="" fill sizes="(max-width:1024px) 33vw, 16vw" className="object-cover transition duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-forest-950/70 opacity-0 transition duration-500 group-hover:opacity-100">
                <Instagram className="h-7 w-7 text-gold-300" />
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={SITE.instagram} target="_blank" rel="noopener" className="btn-outline"><Instagram className="h-4 w-4" /> {t('insta.follow')}</a>
        </div>
      </div>
    </section>
  );
}
