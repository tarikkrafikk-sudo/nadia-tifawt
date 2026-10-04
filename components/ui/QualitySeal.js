// Sceau doré générique (ce n'est PAS le logo officiel de l'ONSSA)
export default function QualitySeal({ className = 'h-20 w-20' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="sealG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF4C8" /><stop offset=".4" stopColor="#D4AF37" /><stop offset=".7" stopColor="#8F6F1F" /><stop offset="1" stopColor="#F3E3B0" /></linearGradient>
        <path id="sealArc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      {[...Array(24)].map((_, i) => (
        <path key={i} d="M60 2 L64 10 L56 10Z" fill="url(#sealG)" transform={`rotate(${i * 15} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="50" fill="#12291B" stroke="url(#sealG)" strokeWidth="3" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="url(#sealG)" strokeWidth="1.2" />
      <text fontSize="7.2" fontWeight="700" letterSpacing="1.6" fill="#E2C77E" fontFamily="Montserrat, sans-serif">
        <textPath href="#sealArc" startOffset="2%">SÉCURITÉ SANITAIRE · CONTRÔLÉ ·</textPath>
      </text>
      <svg x="44" y="22" width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="#D4AF37" strokeWidth="9" strokeLinecap="round"><path d="M50 8V92M20 8C20 32 32 40 50 40C68 40 80 32 80 8M20 92C20 68 32 60 50 60C68 60 80 68 80 92M30 50H70" /></svg>
      <path d="M46 72 l9 9 l19 -21" fill="none" stroke="url(#sealG)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />
    </svg>
  );
}
