import PageHeader from '@/components/ui/PageHeader';
import { getSettings } from '@/lib/data';
import { getI18n } from '@/lib/i18n/server';

export async function generateMetadata() {
  const { t } = getI18n();
  return { title: t('legal.title'), alternates: { canonical: '/mentions-legales' } };
}

export default async function LegalPage() {
  const { t } = getI18n();
  const { company: c } = await getSettings();
  const status = t(`legal.statuses.${c.status}`);
  const rows = (keys) => keys.map((k) => [t(`legal.${k}`), k === 'status' ? (status.startsWith('legal.') ? c.status : status) : c[k], k]).filter(([, v]) => v);

  const Section = ({ title, items }) => (
    <section className="card-lux p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-cream">{title}</h2>
      <dl className="mt-5 divide-y divide-gold-500/10">
        {items.map(([label, value, k]) => (
          <div key={label} className="grid gap-1 py-3 sm:grid-cols-[260px_1fr] sm:gap-6">
            <dt className="text-xs uppercase tracking-[0.18em] text-gold-500">{label}</dt>
            <dd className={`text-cream/85 ${['ice', 'taxId', 'tp', 'aeNumber', 'rc', 'phone'].includes(k) ? 'font-mono tracking-wider' : ''}`} dir={['ice', 'taxId', 'tp', 'aeNumber', 'rc', 'phone', 'email'].includes(k) ? 'ltr' : undefined}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );

  return (
    <>
      <PageHeader title={t('legal.title')} eyebrow={t('legal.eyebrow')} crumbs={[[t('legal.title')]]} />
      <div className="container max-w-4xl space-y-6 py-14">
        <Section title={t('legal.publisher')} items={rows(['tradeName', 'legalName', 'status', 'address'])} />
        <Section title={t('legal.ids')} items={rows(['ice', 'taxId', 'tp', 'aeNumber', 'rc'])} />
        <Section title={t('legal.contact')} items={rows(['email', 'phone'])} />
        <section className="card-lux p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-cream">{t('legal.data')}</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">{t('legal.dataText')}</p>
          <h2 className="mt-8 font-serif text-2xl text-cream">{t('legal.hosting')}</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">{t('legal.hostingText')}</p>
        </section>
      </div>
    </>
  );
}
