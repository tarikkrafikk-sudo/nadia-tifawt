import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSettings, updateSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PATCH(req) {
  const body = await req.json();
  const o = body.onssa || {};
  const onssa = {};
  for (const k of ['number', 'type', 'holder', 'activity', 'city', 'issuedAt', 'document']) if (o[k] !== undefined) onssa[k] = String(o[k]).trim().slice(0, 300);
  if (o.enabled !== undefined) onssa.enabled = Boolean(o.enabled);
  if (onssa.enabled && !(onssa.number ?? (await getSettings()).onssa.number)) {
    return NextResponse.json({ error: 'Renseignez le numéro ONSSA avant d’activer le badge.' }, { status: 400 });
  }
  const c = body.company || {};
  const company = {};
  for (const k of ['tradeName', 'legalName', 'status', 'ice', 'taxId', 'tp', 'aeNumber', 'rc', 'address', 'email', 'phone']) if (c[k] !== undefined) company[k] = String(c[k]).trim().slice(0, 200);
  if (c.showInFooter !== undefined) company.showInFooter = Boolean(c.showInFooter);
  if (company.ice && !/^\d{15}$/.test(company.ice)) return NextResponse.json({ error: 'L’ICE doit contenir exactement 15 chiffres.' }, { status: 400 });
  const settings = await updateSettings({ onssa, company });
  revalidatePath('/', 'layout');
  return NextResponse.json(settings);
}
