import Yaz from './Yaz';

// Grand ⵣ en filigrane, très discret
export default function Watermark({ className = '' }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute select-none text-gold-500/[0.045] ${className}`}>
      <Yaz className="h-full w-full" strokeWidth={3} />
    </div>
  );
}
