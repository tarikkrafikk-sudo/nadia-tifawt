import CheckoutForm from '@/components/checkout/CheckoutForm';
import PageHeaderClient from '@/components/ui/PageHeaderClient';
import { PAYMENT_METHODS } from '@/lib/payments';
import { getI18n } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { t } = getI18n();
  return { title: t('checkout.title'), robots: { index: false } };
}

export default function CheckoutPage() {
  const { t } = getI18n();
  return (
    <>
      <PageHeaderClient title={t('checkout.title')}>
        <p className="mt-4 text-sm text-cream/60">{t('checkout.sub')}</p>
      </PageHeaderClient>
      <CheckoutForm methods={PAYMENT_METHODS.map(({ id, enabled }) => ({ id, enabled }))} />
    </>
  );
}
