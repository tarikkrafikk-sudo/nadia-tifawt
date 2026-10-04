// Symbole amazigh ⵣ (Yaz) dessiné en SVG — rendu identique sur tous les appareils,
// sans dépendre d'une police Tifinagh.
export default function Yaz({ className = '', strokeWidth = 7, title }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={!title}>
      {title && <title>{title}</title>}
      <path d="M50 8 V92" />
      <path d="M20 8 C20 32 32 40 50 40 C68 40 80 32 80 8" />
      <path d="M20 92 C20 68 32 60 50 60 C68 60 80 68 80 92" />
      <path d="M30 50 H70" />
    </svg>
  );
}
