import { Download, Leaf, FlaskConical, PackageCheck, Thermometer, FileText } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import QualitySeal from '@/components/ui/QualitySeal';
import { Ornament } from '@/components/ui/Ornament';
import { getSettings } from '@/lib/data';
import { getI18n } from '@/lib/i18n/server';

export async function generateMetadata() {
  const { t } = getI18n();
  return { title: `${t('quality.title')} — ONSSA`, description: t('quality.commitments').map((c) => c[1]).join(' '), alternates: { canonical: '/qualite' } };
}

const ICONS = [Leaf, FlaskConical, Thermometer, PackageCheck];

const fmtDate = (d, l) => (d ? new Date(d).toLocaleDateString(l === 'ar' ? 'ar-MA' : l === 'en' ? 'en-GB' : 'fr-MA', { day: '2-digit', month: 'long', year: 'numeric' }) : null);

export default async function QualityPage() {
  const { onssa } = await getSettings();
  const { t, locale } = getI18n();
  const COMMITMENTS = t('quality.commitments').map(([a, b], i) => [ICONS[i], a, b]);
  const show = onssa.enabled && onssa.number;
  const isPdf = onssa.document?.toLowerCase().includes('.pdf');

  return (
    <>
      <PageHeader title={t('quality.title')} eyebrow={t('quality.eyebrow')} crumbs={[[t('crumbs.quality')]]} />

      {show && (
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            {/* Certificat encadré */}
            <div className="relative rounded-[28px] bg-gold-metal p-[2px] shadow-luxe">
              <div className="amazigh-pattern relative overflow-hidden rounded-[26px] bg-forest-900 p-8 sm:p-12">
                <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-gold-500/25" />
                <div className="flex flex-col items-center text-center">
                  <QualitySeal className="h-28 w-28" />
                  <p className="eyebrow mt-6">{t('quality.kingdom')}</p>
                  <h2 className="text-gold-metal mt-3 font-serif text-4xl sm:text-5xl">{t(`onssa.types.${onssa.type}`)}</h2>
                  <p className="mt-3 text-sm text-cream/60">{t('quality.office')}</p>
                  <Ornament className="my-8" symbol />
                </div>
                <dl className="mx-auto grid max-w-2xl gap-x-10 gap-y-5 sm:grid-cols-2">
                  {[
                    [t('quality.fields.number'), <span key="n" dir="ltr" className="font-mono text-xl tracking-wider text-gold-300">{onssa.number}</span>],
                    [t('quality.fields.holder'), onssa.holder],
                    [t('quality.fields.activity'), onssa.activity],
                    [t('quality.fields.city'), onssa.city],
                    [t('quality.fields.date'), fmtDate(onssa.issuedAt, locale)],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="border-b border-gold-500/15 pb-3">
                      <dt className="text-[10px] uppercase tracking-[0.25em] text-gold-500">{k}</dt>
                      <dd className="mt-1 text-cream">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            {onssa.document && (
              <div className="mt-10 mx-auto max-w-lg overflow-hidden rounded-2xl border border-gold-500/25 bg-cream">
                {isPdf
                  ? <object data={onssa.document} type="application/pdf" className="h-[80vh] w-full"><p className="p-6 text-forest-900">{t('quality.noPreview')} <a className="underline" href={onssa.document}>{t('quality.openPdf')}</a>.</p></object>
                  // eslint-disable-next-line @next/next/no-img-element
                  : <img src={onssa.document} alt={`${onssa.type} ONSSA N° ${onssa.number} — ${onssa.holder}`} className="mx-auto w-full max-w-3xl" />}
              </div>
            )}
          </div>
        </section>
      )}

      <section className={`container ${show ? 'pb-20' : 'py-16'}`}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMMITMENTS.map(([I, t, d]) => (
            <div key={t} className="card-lux p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-500/40 text-gold-300"><I className="h-5 w-5" strokeWidth={1.4} /></span>
              <h3 className="mt-4 font-serif text-2xl text-cream">{t}</h3>
              <p className="mt-2 text-sm text-cream/60">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
