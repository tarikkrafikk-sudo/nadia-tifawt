// Rendu des visuels produits de démo en JPG (1000×1250).
// Usage : node scripts/art/render-products.mjs   (nécessite `npm i -D playwright`)
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { scene, honeyJar, creamJar, bottle, P } from './scene.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const OUT = path.join(ROOT, 'public/images/products');
const font = (p) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource', p)).toString('base64');

const honeyProps = (n) => P.comb(250, 1110, 0.85) + P.dipper(800, 1120, -14, 0.95) + P.leaf(80, 1180, -20, 1.1) + P.blossom(370, 1180, 1) + (n % 2 ? P.blossom(690, 1200, 0.8) : P.leaf(860, 1200, 200, 0.9));
const amlouProps = () =>
  [[230, 1120, 20], [300, 1170, -40], [180, 1190, 70], [720, 1130, -10], [790, 1180, 50], [660, 1195, -70], [850, 1120, 15]].map(([x, y, a]) => P.almond(x, y, a, 1.1)).join('') +
  P.argan(400, 1205, 30, 1) + P.argan(600, 1210, -20, 0.9) + P.leaf(40, 1100, -10, 1);
const beautyProps = (extra = '') => P.leaf(150, 1130, -25, 1.2) + P.leaf(860, 1150, 200, 1.1) + P.blossom(270, 1190, 1.1) + P.blossom(760, 1205, 0.9) + extra;

const ITEMS = {
  'miel-euphorbe': scene({ seedN: 1, product: honeyJar('#C9861B', 'EUPHORBE', '', { fs: 44 }), props: honeyProps(1) }),
  'miel-thym': scene({ seedN: 2, product: honeyJar('#DDA53C', 'THYM', '', { fs: 54 }), props: honeyProps(2) }),
  'miel-sidr': scene({ seedN: 3, product: honeyJar('#A0581A', 'SIDR', 'MIEL DE JUJUBIER'), props: honeyProps(3) }),
  'miel-oranger': scene({ seedN: 4, product: honeyJar('#E9BC5C', 'ORANGER', 'FLEUR D’ORANGER'), props: honeyProps(4) + P.blossom(160, 1060, 0.7) }),
  'amlou-traditionnel': scene({ seedN: 5, product: honeyJar('#7A4824', 'AMLOU', '', { opaque: true, fs: 54 }), props: amlouProps() }),
  'amlou-miel': scene({ seedN: 6, product: honeyJar('#8E5626', 'AMLOU ROYAL', 'AMANDES · MIEL', { opaque: true, fs: 31 }), props: amlouProps() + P.dipper(820, 1060, -10, 0.7) }),
  'creme-visage-miel': scene({ seedN: 7, s: 1.05, product: creamJar('CRÈME MIEL', ''), props: beautyProps(P.comb(860, 1060, 0.45)) }),
  'baume-argan': scene({ seedN: 8, s: 1.05, product: creamJar('BAUME', 'NUIT · ARGAN', { body: '#7a4a14', glass: true }), props: beautyProps(P.argan(380, 1200, 10, 1) + P.argan(640, 1215, -30, 0.9)) }),
  'masque-miel-ghassoul': scene({ seedN: 9, s: 0.95, product: creamJar('GHASSOUL', 'MASQUE · MIEL · ROSE'), props: P.bowl(810, 1150, '#b4745a', 0.85) + P.petals(330, 1190) + P.leaf(40, 1120, -20, 1) + P.blossom(600, 1210, 0.8) }),
  'huile-argan': scene({ seedN: 10, s: 0.95, product: bottle('#C68A1E', 'ARGAN', 'HUILE PURE'), props: [[250, 1140], [320, 1190], [700, 1150], [770, 1200], [660, 1210]].map(([x, y], i) => P.argan(x, y, i * 40, 1.15)).join('') + P.leaf(60, 1120, -15, 1.1) + P.leaf(880, 1110, 200, 1) }),
  'huile-figue-barbarie': scene({ seedN: 11, s: 0.95, accent: '#c2405a', product: bottle('#8E2438', 'FIGUE', 'DE BARBARIE'), props: P.pear(240, 1130, 1.1) + P.pear(790, 1150, 0.95) + P.leaf(60, 1190, -10, 1) + P.blossom(640, 1210, 0.8) }),
  'savon-noir': scene({ seedN: 12, s: 0.95, product: creamJar('SAVON NOIR', 'BELDI · HAMMAM', { body: '#3a3416', glass: true }), props: P.bowl(800, 1150, '#2e2a12', 0.8, '<ellipse cx="-20" cy="-42" rx="40" ry="6" fill="#fff" opacity=".25"/>') + P.euca(20, 1170, -8, 1) + P.blossom(420, 1205, 0.8) }),
};

const html = (svg) => `<!doctype html><html><head><style>
@font-face{font-family:Cormorant;font-weight:700;src:url(${font('cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2')})}
@font-face{font-family:Montserrat;font-weight:600;src:url(${font('montserrat/files/montserrat-latin-600-normal.woff2')})}
@font-face{font-family:Montserrat;font-weight:500;src:url(${font('montserrat/files/montserrat-latin-500-normal.woff2')})}
html,body{margin:0;background:#12291B}</style></head><body>${svg}</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1000, height: 1250 } });
const only = process.argv[2];
for (const [name, svg] of Object.entries(ITEMS)) {
  if (only && name !== only) continue;
  await page.setContent(html(svg), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: 86 });
  console.log('✔', name);
}
await browser.close();
