'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Zoom au survol : UNIQUEMENT sur ordinateur (souris). Sur téléphone/tablette, aucun zoom :
// l'image reste à sa taille normale et la page défile normalement.
export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const update = () => { setCanHover(mq.matches); if (!mq.matches) setZoom((z) => ({ ...z, on: false })); };
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => { setZoom((z) => ({ ...z, on: false })); }, [active]);

  const onMove = (e) => {
    if (!canHover || e.pointerType !== 'mouse') return; // ignore le toucher (iPhone / Android)
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const stop = () => setZoom((z) => ({ ...z, on: false }));
  const zoomed = canHover && zoom.on;

  return (
    <div className="flex flex-col-reverse gap-4 lg:sticky lg:top-28 lg:flex-row">
      <div className={`no-scrollbar flex gap-3 overflow-x-auto lg:flex-col ${images.length < 2 ? 'hidden' : ''}`}>
        {images.map((src, i) => (
          <button key={src + i} type="button" onClick={() => setActive(i)} aria-label={`${i + 1}`}
            className={`relative h-20 w-20 shrink-0 touch-manipulation overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-24 ${i === active ? 'border-gold-400 shadow-gold' : 'border-gold-500/15 opacity-60 hover:opacity-100'}`}>
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
      <div
        className="relative mx-auto aspect-square max-h-[60vh] w-full flex-1 touch-manipulation overflow-hidden rounded-3xl border border-gold-500/25 bg-forest-800 lg:max-h-[80vh] lg:cursor-zoom-in"
        style={{ touchAction: 'pan-y pinch-zoom' }}
        onPointerMove={onMove}
        onPointerLeave={stop}
        onPointerCancel={stop}
      >
        <AnimatePresence mode="wait">
          <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Image src={images[active]} alt={name} fill priority sizes="(max-width:1024px) 100vw, 50vw"
              draggable={false}
              className="select-none object-contain transition-transform duration-300 lg:object-cover"
              style={{ transform: zoomed ? 'scale(1.8)' : 'scale(1)', transformOrigin: `${zoom.x}% ${zoom.y}%` }} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-gold-400/20" />
      </div>
    </div>
  );
}
