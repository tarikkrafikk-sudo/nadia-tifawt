import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ compact = false }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="NADIA TIFAWT — Accueil">
      <span className="relative block h-12 w-12 shrink-0 rounded-full p-[2px] bg-gold-metal shadow-gold sm:h-14 sm:w-14">
        <Image src="/images/emblem.png" alt="" width={112} height={112} priority
          className="h-full w-full rounded-full object-cover transition duration-700 group-hover:scale-105" />
      </span>
      {!compact && (
        <span className="latin flex flex-col leading-none" dir="ltr">
          <span className="text-gold-shine font-serif text-[26px] font-semibold tracking-[0.12em] sm:text-[30px]">NADIA</span>
          <span className="mt-1 flex items-center gap-2 text-[10px] font-semibold tracking-[0.55em] text-gold-400">
            TIFAWT
          </span>
        </span>
      )}
    </Link>
  );
}
