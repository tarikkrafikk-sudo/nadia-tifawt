import Link from 'next/link';
import Yaz from '@/components/ui/Yaz';
import { getI18n } from '@/lib/i18n/server';

export default function NotFound() {
  const { t } = getI18n();
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <Yaz className="h-16 w-16 text-gold-500/50" strokeWidth={5} />
      <h1 className="text-gold-metal font-serif text-6xl">404</h1>
      <p className="max-w-md text-cream/65">{t('notFound.text')}</p>
      <Link href="/boutique" className="btn-gold">{t('notFound.back')}</Link>
    </section>
  );
}
