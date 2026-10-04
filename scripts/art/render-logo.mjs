// Rendu de l'emblème anime (PNG transparents + favicons + SVG source).
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { girlSVG } from './girl.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const pub = (p) => path.join(ROOT, 'public', p);
fs.writeFileSync(pub('images/emblem-anime.svg'), girlSVG());

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
const shot = async (size, file, opts = {}) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${girlSVG(opts).replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`);
  await page.screenshot({ path: pub(file), omitBackground: true });
  console.log('✔', file);
};
await shot(1024, 'images/emblem.png');
await shot(512, 'icon-512.png');
await shot(192, 'icon-192.png');
await shot(180, 'icon-180.png');
await shot(64, 'icon-64.png');
await shot(32, 'icon-32.png');
await shot(1024, 'images/emblem-square.png', { frame: false });
await browser.close();
