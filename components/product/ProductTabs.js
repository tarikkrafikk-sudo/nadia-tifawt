'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Loader2, CheckCircle2, ImagePlus, X } from 'lucide-react';
import Stars from '@/components/ui/Stars';
import { useI18n } from '@/context/I18nContext';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { uploadImage } from '@/lib/client-image';

export default function ProductTabs({ product, reviews }) {
  const { t, locale } = useI18n();
  const tabs = [
    ['description', t('product.tabs.description')],
    ['ingredients', t('product.tabs.ingredients')],
    ['avis', t('product.tabs.reviews', { n: reviews.length })],
  ];
  const [tab, setTab] = useState('description');

  return (
    <div id="avis">
      <div role="tablist" className="no-scrollbar flex gap-8 overflow-x-auto border-b border-gold-500/20">
        {tabs.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`relative shrink-0 pb-4 text-[12px] font-semibold uppercase tracking-[0.22em] transition ${tab === id ? 'text-gold-300' : 'text-cream/50 hover:text-cream'}`}>
            {l}
            {tab === id && <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-metal" />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          className="py-8 text-[15px] leading-relaxed text-cream/75">
          {tab === 'description' && <p className="max-w-3xl">{product.description}</p>}
          {tab === 'ingredients' && (
            <div className="grid gap-8 md:grid-cols-2">
              <div><h3 className="mb-2 font-serif text-2xl text-cream">{t('product.composition')}</h3><p>{product.ingredients}</p></div>
              <div><h3 className="mb-2 font-serif text-2xl text-cream">{t('product.usage')}</h3><p>{product.usage}</p></div>
            </div>
          )}
          {tab === 'avis' && (
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-5xl text-gold-300">{product.rating?.toFixed(1)}</span>
                    <div><Stars value={product.rating} size={18} /><p className="mt-1 text-xs text-cream/50">{t('product.verified', { n: reviews.length })}</p></div>
                  </div>
                ) : <p className="font-serif text-2xl text-cream">{t('product.noReviews')}</p>}
                <ul className="grid gap-4 md:grid-cols-2">
                  {reviews.map((r) => <ReviewItem key={r._id} r={r} />)}
                </ul>
              </div>
              <ReviewForm product={product} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
