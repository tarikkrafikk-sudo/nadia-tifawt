'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, PenLine, MessageCircle, BadgeCheck } from 'lucide-react';
import { SectionTitle } from '@/components/ui/Ornament';
import Stars from '@/components/ui/Stars';
import ReviewForm from '@/components/product/ReviewForm';
import { useI18n } from '@/context/I18nContext';
import { waLink } from '@/lib/utils';

// Avis réels publiés depuis /admin/avis (mis en avant en priorité) + formulaire pour en laisser un
export default function Testimonials({ reviews = [], products = [] }) {
  const [i, setI] = useState(0);
  const [writing, setWriting] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % reviews.length), 6500);
    return () => clearInterval(id);
  }, [reviews.length]);
  const r = reviews[i % Math.max(1, reviews.length)];

  return (
    <section id="avis" className="relative scroll-mt-28 overflow-hidden bg-forest-950/50 py-20 sm:py-28">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="container relative">
        <SectionTitle eyebrow={t('testi.eyebrow')} title={t('testi.title')} />

        <div className="mx-auto mt-12 max-w-3xl text-center">
          {reviews.length > 0 ? (
            <>
              <Quote className="mx-auto h-10 w-10 text-gold-500/50" strokeWidth={1} />
              <div className="relative min-h-[240px] sm:min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.figure key={r._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.7 }}>
                    <blockquote className="mt-6 font-serif text-2xl italic leading-relaxed text-cream sm:text-3xl">« {r.text} »</blockquote>
                    {r.photos?.length > 0 && (
                      <div className="mt-5 flex justify-center gap-2">
                        {r.photos.slice(0, 3).map((src) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={src} src={src} alt="" loading="lazy" className="h-16 w-16 rounded-lg border border-gold-500/30 object-cover" />
                        ))}
                      </div>
                    )}
                    <figcaption className="mt-6 flex flex-col items-center gap-2">
                      <Stars value={r.rating} />
                      <span className="text-sm font-semibold tracking-wide text-gold-300">{r.name}</span>
                      <span className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-cream/50">
                        <span className="uppercase tracking-[0.25em]">{[r.city, r.productName].filter(Boolean).join(' · ')}</span>
                        {r.verified && <span className="inline-flex items-center gap-1 rounded-full bg-forest-600/60 px-2 py-0.5 text-gold-200"><BadgeCheck className="h-3.5 w-3.5" /> {t('rv.verified')}</span>}
                        {r.source && r.source !== 'site' && <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {t(`rv.via.${r.source}`)}</span>}
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
              {reviews.length > 1 && (
                <div className="mt-8 flex justify-center gap-3">
                  {reviews.map((x, k) => (
                    <button key={x._id} onClick={() => setI(k)} aria-label={t('testi.item', { n: k + 1 })}
                      className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-gold-400' : 'w-4 bg-gold-500/30'}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card-lux mx-auto max-w-2xl p-8 sm:p-10">
              <Stars value={5} size={22} className="justify-center" />
              <p className="mt-5 font-serif text-3xl text-cream">{t('testi.empty')}</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-cream/65">{t('testi.emptySub')}</p>
            </div>
          )}

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button onClick={() => setWriting((w) => !w)} className="btn-gold"><PenLine className="h-4 w-4" /> {t('testi.write')}</button>
            <a href={waLink(t('testi.waText'))} target="_blank" rel="noopener" className="btn-outline"><MessageCircle className="h-4 w-4" /> {t('testi.whatsapp')}</a>
          </div>

          <AnimatePresence>
            {writing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mx-auto mt-8 max-w-lg"><ReviewForm products={products} /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
