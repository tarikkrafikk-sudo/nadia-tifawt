'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const L = {
  fr: { tap: 'Toucher pour zoomer', close: 'Fermer', zin: 'Zoom avant', zout: 'Zoom arrière', prev: 'Image précédente', next: 'Image suivante' },
  en: { tap: 'Tap to zoom', close: 'Close', zin: 'Zoom in', zout: 'Zoom out', prev: 'Previous image', next: 'Next image' },
  ar: { tap: 'المس للتكبير', close: 'إغلاق', zin: 'تكبير', zout: 'تصغير', prev: 'الصورة السابقة', next: 'الصورة التالية' },
};
const EASE = [0.22, 1, 0.36, 1];
const MAX = 4;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ═════════════════════════ Galerie produit ═════════════════════════ */
export default function ProductGallery({ images, name }) {
  const { locale } = useI18n();
  const tx = L[locale] || L.fr;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState({ on: false, x: 50, y: 50 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const onMove = (e) => {
    if (!canHover || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setHover({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const zoomed = canHover && hover.on;

  return (
    <div className="flex flex-col-reverse gap-4 lg:sticky lg:top-28 lg:flex-row">
      {/* Miniatures */}
      <div className={`no-scrollbar flex gap-3 overflow-x-auto lg:flex-col ${images.length < 2 ? 'hidden' : ''}`}>
        {images.map((src, i) => (
          <button key={src + i} type="button" onClick={() => setActive(i)} aria-label={`${i + 1}`}
            className={`relative h-20 w-20 shrink-0 touch-manipulation overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-24 ${i === active ? 'border-gold-400 shadow-gold' : 'border-gold-500/15 opacity-60 hover:opacity-100'}`}>
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Image principale : pleine largeur sur mobile, zoom au survol sur ordinateur, plein écran au clic */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        onPointerMove={onMove}
        onPointerLeave={() => setHover((h) => ({ ...h, on: false }))}
        aria-label={`${name} — ${tx.tap}`}
        className="group relative block aspect-[4/5] min-h-[380px] w-full flex-1 touch-manipulation overflow-hidden rounded-3xl border border-gold-500/25 bg-[#0a2a1a] text-left sm:aspect-square lg:min-h-0 lg:cursor-zoom-in"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Image src={images[active]} alt={name} fill priority sizes="(max-width:1024px) 100vw, 50vw" draggable={false}
              className="select-none object-cover transition-transform duration-500 ease-out"
              style={{ transform: zoomed ? 'scale(1.8)' : 'scale(1)', transformOrigin: `${hover.x}% ${hover.y}%` }} />
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute inset-3 rounded-[20px] border border-gold-400/20" />
        {/* Indice mobile */}
        <span className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-black/45 px-3 py-1.5 text-[11px] font-medium tracking-wide text-gold-100 backdrop-blur-md lg:hidden">
          <ZoomIn className="h-3.5 w-3.5 text-gold-300" /> {tx.tap}
        </span>
        {images.length > 1 && (
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] tabular-nums text-gold-100 backdrop-blur-md lg:hidden">
            {active + 1} / {images.length}
          </span>
        )}
      </button>

      <Lightbox open={open} images={images} index={active} setIndex={setActive} name={name} tx={tx} onClose={() => setOpen(false)} />
    </div>
  );
}

/* ═════════════════════════ Visionneuse plein écran ═════════════════════════ */
function Lightbox({ open, images, index, setIndex, name, tx, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [live, setLive] = useState(false); // geste en cours → pas de transition CSS
  const [dragY, setDragY] = useState(0);   // glisser vers le bas pour fermer
  const stage = useRef(null);
  const pts = useRef(new Map());
  const g = useRef({});
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => setMounted(true), []);
  useEffect(() => { setView({ s: 1, x: 0, y: 0 }); setDragY(0); }, [index, open]);

  // Bloque le défilement de la page + clavier
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === '+' || e.key === '=') zoomBy(1.5);
      if (e.key === '-') zoomBy(1 / 1.5);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', onKey); };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const size = () => {
    const r = stage.current?.getBoundingClientRect();
    return r ? { w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 } : { w: 1, h: 1, cx: 0, cy: 0 };
  };
  const bound = useCallback((v) => {
    const { w, h } = size();
    const mx = ((v.s - 1) * w) / 2, my = ((v.s - 1) * h) / 2;
    return { s: v.s, x: clamp(v.x, -mx, mx), y: clamp(v.y, -my, my) };
  }, []);
  // Zoom centré sur un point de l'écran (px, py)
  const zoomAt = useCallback((s1, px, py, base = viewRef.current) => {
    const { cx, cy } = size();
    const s = clamp(s1, 1, MAX);
    const rx = px - cx, ry = py - cy;
    const k = s / base.s;
    return bound({ s, x: rx - (rx - base.x) * k, y: ry - (ry - base.y) * k });
  }, [bound]);
  const zoomBy = (f) => { const { cx, cy } = size(); setLive(false); setView(zoomAt(viewRef.current.s * f, cx, cy)); };
  const go = (d) => { if (images.length > 1) setIndex((i) => (i + d + images.length) % images.length); };

  /* ── gestes tactiles / souris ── */
  const onDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const list = [...pts.current.values()];
    setLive(true);
    if (list.length === 2) {
      const [a, b] = list;
      g.current = { mode: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y), mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, v0: viewRef.current };
    } else if (list.length === 1) {
      g.current = { mode: 'drag', x0: e.clientX, y0: e.clientY, v0: viewRef.current, t0: Date.now() };
    }
  };
  const onMove = (e) => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const st = g.current;
    if (st.mode === 'pinch' && pts.current.size >= 2) {
      const [a, b] = [...pts.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const z = zoomAt(st.v0.s * (d / st.d0), st.mid.x, st.mid.y, st.v0);
      setView(bound({ s: z.s, x: z.x + (mid.x - st.mid.x), y: z.y + (mid.y - st.mid.y) }));
    } else if (st.mode === 'drag') {
      const dx = e.clientX - st.x0, dy = e.clientY - st.y0;
      if (st.v0.s > 1.01) setView(bound({ s: st.v0.s, x: st.v0.x + dx, y: st.v0.y + dy }));
      else { setView({ s: 1, x: dx * 0.9, y: 0 }); setDragY(Math.max(0, dy)); }
    }
  };
  const onUp = (e) => {
    const st = g.current;
    const p = pts.current.get(e.pointerId);
    pts.current.delete(e.pointerId);
    if (pts.current.size === 1 && st.mode === 'pinch') {
      // un doigt reste : on reprend en déplacement
      const [rest] = [...pts.current.values()];
      g.current = { mode: 'drag', x0: rest.x, y0: rest.y, v0: viewRef.current, t0: 0 };
      return;
    }
    if (pts.current.size) return;
    setLive(false);
    if (st.mode === 'pinch') { if (viewRef.current.s < 1.05) setView({ s: 1, x: 0, y: 0 }); return; }
    if (st.mode !== 'drag' || !p) return;

    const dx = p.x - st.x0, dy = p.y - st.y0, moved = Math.hypot(dx, dy);
    if (st.v0.s <= 1.01) {
      if (dy > 110 && Math.abs(dy) > Math.abs(dx)) return onClose();         // glisser vers le bas → fermer
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) { go(dx < 0 ? 1 : -1); return; } // swipe → image suivante
      setView({ s: 1, x: 0, y: 0 }); setDragY(0);
    }
    // Double-tap / double-clic : zoom ×2.5 ↔ 1
    if (moved < 10 && Date.now() - st.t0 < 300) {
      const now = Date.now(), lt = lastTap.current;
      if (now - lt.t < 320 && Math.hypot(p.x - lt.x, p.y - lt.y) < 40) {
        setView(viewRef.current.s > 1.05 ? { s: 1, x: 0, y: 0 } : zoomAt(2.5, p.x, p.y));
        lastTap.current = { t: 0, x: 0, y: 0 };
      } else lastTap.current = { t: now, x: p.x, y: p.y };
    }
  };
  const onWheel = (e) => { setLive(false); setView(zoomAt(viewRef.current.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY)); };

  if (!mounted) return null;
  const fade = 1 - Math.min(dragY / 400, 0.6);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-modal="true" aria-label={name}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
          style={{ backgroundColor: `rgba(0,0,0,${0.95 * fade})` }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}
        >
          {/* Barre du haut */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] text-gold-100">
            <span className="text-xs tracking-[0.25em] text-gold-300/80 tabular-nums">{images.length > 1 ? `${index + 1} / ${images.length}` : ''}</span>
            <button type="button" onClick={onClose} aria-label={tx.close}
              className="grid h-11 w-11 place-items-center rounded-full border border-gold-400/40 bg-white/5 text-gold-100 backdrop-blur-md transition hover:bg-gold-500 hover:text-forest-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scène */}
          <div ref={stage} className="relative flex-1 select-none overflow-hidden"
            style={{ touchAction: 'none', cursor: view.s > 1 ? 'grab' : 'zoom-in' }}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={index} className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45, ease: EASE }}>
                <div className="absolute inset-0 will-change-transform"
                  style={{
                    transform: `translate3d(${view.x}px, ${view.y + dragY}px, 0) scale(${view.s * (1 - Math.min(dragY / 1600, 0.15))})`,
                    transition: live ? 'none' : 'transform 380ms cubic-bezier(.22,1,.36,1)',
                  }}>
                  <Image src={images[index]} alt={name} fill sizes="100vw" quality={95} draggable={false} className="pointer-events-none object-contain" />
                </div>
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && view.s <= 1.01 && (
              <>
                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => go(-1)} aria-label={tx.prev}
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold-400/30 bg-white/5 text-gold-100 backdrop-blur-md transition hover:bg-gold-500 hover:text-forest-900 sm:grid">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => go(1)} aria-label={tx.next}
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold-400/30 bg-white/5 text-gold-100 backdrop-blur-md transition hover:bg-gold-500 hover:text-forest-900 sm:grid">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Commandes de zoom */}
          <div className="relative z-10 flex items-center justify-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            <div className="flex items-center gap-1 rounded-full border border-gold-400/30 bg-white/5 p-1 backdrop-blur-md">
              <button type="button" onClick={() => zoomBy(1 / 1.5)} disabled={view.s <= 1.01} aria-label={tx.zout}
                className="grid h-11 w-11 place-items-center rounded-full text-gold-100 transition hover:bg-gold-500 hover:text-forest-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-100">
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-14 text-center text-xs tabular-nums tracking-wider text-gold-300">{Math.round(view.s * 100)}%</span>
              <button type="button" onClick={() => zoomBy(1.5)} disabled={view.s >= MAX - 0.01} aria-label={tx.zin}
                className="grid h-11 w-11 place-items-center rounded-full text-gold-100 transition hover:bg-gold-500 hover:text-forest-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-100">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
