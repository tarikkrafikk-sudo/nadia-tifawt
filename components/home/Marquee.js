'use client';
import { motion } from 'framer-motion';
import Yaz from '@/components/ui/Yaz';
import { useI18n } from '@/context/I18nContext';

export default function Marquee() {
  const { t, dir } = useI18n();
  const WORDS = t('marquee');
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-gold-500/20 bg-forest-950/55 py-5 backdrop-blur-sm" aria-hidden>
      <motion.div className="flex w-max gap-10" animate={{ x: dir === 'rtl' ? ['0%', '50%'] : ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-serif text-2xl italic text-gold-300/85">
            {w} <Yaz className="h-5 w-5 text-gold-500/70" strokeWidth={8} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
