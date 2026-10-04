import { Leaf, MapPin, Hand, Truck, ShieldCheck, Flower2 } from 'lucide-react';
import { getI18n } from '@/lib/i18n/server';

const ICONS = { miel: [Leaf, MapPin, Flower2], amlou: [Leaf, Hand, MapPin], cosmetiques: [Leaf, Hand, MapPin] };

export default function Benefits({ category }) {
  const { t } = getI18n();
  const cat = ICONS[category] ? category : 'miel';
  const list = [
    ...t(`product.benefits.${cat}`).map(([a, b], i) => [ICONS[cat][i], a, b]),
    ...t('product.benefits.common').map(([a, b], i) => [[Truck, ShieldCheck][i], a, b]),
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {list.map(([I, title, d]) => (
        <li key={title} className="flex flex-col items-center gap-2 rounded-2xl border border-gold-500/15 bg-forest-800/40 p-4 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/40 text-gold-300"><I className="h-5 w-5" strokeWidth={1.4} /></span>
          <b className="text-[12px] font-semibold text-cream">{title}</b>
          <span className="text-[11px] text-cream/50">{d}</span>
        </li>
      ))}
    </ul>
  );
}
