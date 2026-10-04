'use client';
import { usePathname } from 'next/navigation';
import { SITE, waLink } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export const WaIcon = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
    <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.99L4 29l8.27-1.590a12.1 12.1 0 0 0 3.77.6C22.68 28 28 22.64 28 16.03 28 9.4 22.68 3 16.04 3Zm0 22.86c-1.2 0-2.37-.2-3.48-.6l-.25-.09-4.9.94.95-4.73-.16-.26a9.9 9.9 0 0 1-1.520-5.15c0-5.5 4.48-9.98 9.36-9.98 5.5 0 9.86 4.48 9.86 10.04 0 5.5-4.37 9.83-9.86 9.83Zm5.42-7.37c-.3-.15-1.760-.86-2.030-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35Z" />
  </svg>
);

// Bouton WhatsApp flottant avec le numéro visible
export default function WhatsAppButton() {
  const { t } = useI18n();
  // Au checkout, sur téléphone et tablette, le bouton flottant recouvrirait le formulaire
  // et le bouton « Confirmer » : on le masque (WhatsApp reste accessible dans le header).
  const onCheckout = usePathname()?.startsWith('/checkout');
  return (
    <a href={waLink(t('wa.hello'))} target="_blank" rel="noopener"
      aria-label={`${t('wa.order')} ${SITE.phoneDisplay}`}
      className={`${onCheckout ? 'max-lg:hidden ' : ''}group fixed bottom-5 end-4 z-40 transition-[bottom] duration-300 sm:end-5 max-lg:[.has-sticky-bar_&]:bottom-24 flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1f8a45] to-[#14612f] py-2 pe-2 ps-2 text-white shadow-luxe ring-2 ring-gold-400/80 transition hover:scale-[1.03] sm:pe-5`}>
      <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white/15">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <WaIcon className="relative h-6 w-6" />
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-100">{t('wa.order')}</span>
        <span className="font-semibold tracking-wide" dir="ltr">{SITE.phoneDisplay}</span>
      </span>
    </a>
  );
}
