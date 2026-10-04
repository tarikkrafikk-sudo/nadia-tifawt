import Yaz from './Yaz';

// Séparateur doré inspiré du logo : ligne — losanges — ligne
export function Ornament({ className = '', symbol = false }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden>
      <span className="gold-line w-16 sm:w-24" />
      {symbol ? (
        <Yaz className="h-5 w-5 text-gold-500" strokeWidth={8} />
      ) : (
        <svg viewBox="0 0 60 24" className="h-5 w-14 text-gold-500" fill="currentColor">
          <path d="M30 2 L40 12 L30 22 L20 12Z" fillOpacity=".9" />
          <path d="M30 7 L35 12 L30 17 L25 12Z" fill="#12291B" />
          <path d="M12 8 L16 12 L12 16 L8 12Z M48 8 L52 12 L48 16 L44 12Z" />
          <circle cx="2" cy="12" r="1.5" /><circle cx="58" cy="12" r="1.5" />
        </svg>
      )}
      <span className="gold-line w-16 sm:w-24" />
    </div>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const a = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-4 ${a} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="font-serif text-4xl font-medium leading-tight text-cream sm:text-5xl">{title}</h2>
      {align === 'center' && <Ornament />}
      {subtitle && <p className="max-w-2xl text-[15px] leading-relaxed text-cream/65">{subtitle}</p>}
    </div>
  );
}
