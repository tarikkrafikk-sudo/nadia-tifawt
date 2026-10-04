'use client';
import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  return (
    <div className="flex flex-col-reverse gap-4 lg:sticky lg:top-28 lg:flex-row">
      <div className={`no-scrollbar flex gap-3 overflow-x-auto lg:flex-col ${images.length < 2 ? 'hidden' : ''}`}>
        {images.map((src, i) => (
          <button key={src + i} onClick={() => setActive(i)} aria-label={`${i + 1}`}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-24 ${i === active ? 'border-gold-400 shadow-gold' : 'border-gold-500/15 opacity-60 hover:opacity-100'}`}>
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-3xl border border-gold-500/25 bg-forest-800"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
      >
        <AnimatePresence mode="wait">
          <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <Image src={images[active]} alt={name} fill priority sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-300"
              style={{ transform: zoom.on ? 'scale(1.8)' : 'scale(1)', transformOrigin: `${zoom.x}% ${zoom.y}%` }} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-gold-400/20" />
      </div>
    </div>
  );
}
