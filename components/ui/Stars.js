import { Star } from 'lucide-react';

export default function Stars({ value = 5, size = 14, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size }}
          className={i <= Math.round(value) ? 'fill-gold-400 text-gold-400' : 'text-gold-500/30'} />
      ))}
    </div>
  );
}
