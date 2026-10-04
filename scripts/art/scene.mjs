// Générateur de visuels produits "studio" (SVG -> JPG via Chromium).
// Fond vert forêt + bokeh doré, plateau marbre veiné d'or, reflet, accessoires.

let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const r = (a, b) => a + rnd() * (b - a);

export const YAZ = 'M50 8V92M20 8C20 32 32 40 50 40C68 40 80 32 80 8M20 92C20 68 32 60 50 60C68 60 80 68 80 92M30 50H70';
export const yaz = (cx, cy, s, color, sw = 8, op = 1) =>
  `<g transform="translate(${cx - s / 2} ${cy - s / 2}) scale(${s / 100})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"><path d="${YAZ}"/></g>`;

const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
};

/* ───────────── defs communs ───────────── */
const DEFS = `
<radialGradient id="bg" cx="50%" cy="34%" r="75%"><stop offset="0" stop-color="#2f6342"/><stop offset=".45" stop-color="#16321f"/><stop offset="1" stop-color="#07120b"/></radialGradient>
<linearGradient id="gold" x1="0" x2="1"><stop offset="0" stop-color="#6e5010"/><stop offset=".18" stop-color="#c9a03a"/><stop offset=".34" stop-color="#fff2c0"/><stop offset=".5" stop-color="#d4af37"/><stop offset=".7" stop-color="#9a7424"/><stop offset=".86" stop-color="#f3e3b0"/><stop offset="1" stop-color="#6e5010"/></linearGradient>
<linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4c8"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8f6f1f"/></linearGradient>
<linearGradient id="surf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3d29"/><stop offset=".25" stop-color="#132a1c"/><stop offset="1" stop-color="#08140c"/></linearGradient>
<linearGradient id="edgeShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
<linearGradient id="labelShade" x1="0" x2="1"><stop offset="0" stop-color="#5a4a2a" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a2a10" stop-opacity=".4"/></linearGradient>
<linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="reflMask"><rect x="0" y="1040" width="1000" height="260" fill="url(#fadeDown)"/></mask>
<filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="blur6" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="blur14" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
<filter id="marble" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.028" numOctaves="5" seed="11" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>
  <feComponentTransfer in="a" result="v"><feFuncA type="table" tableValues="0 0 0 0 0 0 .95 0 0 0 0 0 0"/></feComponentTransfer>
  <feFlood flood-color="#E2C77E"/><feComposite in2="v" operator="in" result="gv"/>
  <feGaussianBlur in="gv" stdDeviation=".6"/>
</filter>
<filter id="cloud" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.003 0.012" numOctaves="3" seed="4"/>
  <feColorMatrix values="0 0 0 0 .55  0 0 0 0 .75  0 0 0 0 .6  0 0 0 .5 -.1"/>
</filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .05 0"/></filter>
<radialGradient id="almond" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#e2b07a"/><stop offset=".6" stop-color="#a8683a"/><stop offset="1" stop-color="#6a3a1c"/></radialGradient>
<linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8f5a"/><stop offset="1" stop-color="#1d4a2b"/></linearGradient>
<radialGradient id="petal" cx="50%" cy="80%" r="80%"><stop offset="0" stop-color="#f3eedf"/><stop offset=".7" stop-color="#fffdf6"/><stop offset="1" stop-color="#e9e1cc"/></radialGradient>
<linearGradient id="wood" x1="0" x2="1"><stop offset="0" stop-color="#6b4220"/><stop offset=".4" stop-color="#b9824a"/><stop offset=".6" stop-color="#d29a5c"/><stop offset="1" stop-color="#5a3518"/></linearGradient>
<radialGradient id="comb" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#ffd76a"/><stop offset=".6" stop-color="#e3a227"/><stop offset="1" stop-color="#a8650c"/></radialGradient>
<radialGradient id="terracotta" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#c8673f"/><stop offset=".6" stop-color="#9a3f22"/><stop offset="1" stop-color="#5e2210"/></radialGradient>
`;

function background(accent = '#D4AF37') {
  let bokeh = '';
  for (let i = 0; i < 16; i++) {
    const cx = r(0, 1000), cy = r(60, 820), rad = r(18, 70);
    bokeh += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${rnd() > 0.3 ? accent : '#F5F1E8'}" opacity="${r(0.06, 0.22)}" filter="url(#blur14)"/>`;
  }
  // feuilles floues d'arrière-plan
  let leaves = '';
  for (const [x, y, rot, s] of [[60, 160, 35, 1.6], [930, 260, -140, 1.4], [880, 90, -160, 1.1], [110, 640, 20, 1.2]]) {
    leaves += `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" filter="url(#blur14)" opacity=".55">${leafShape()}</g>`;
  }
  return `
<rect width="1000" height="1250" fill="url(#bg)"/>
<circle cx="500" cy="600" r="330" fill="${accent}" opacity=".12" filter="url(#blur30)"/>
${leaves}${bokeh}
${yaz(820, 210, 190, '#D4AF37', 4, 0.07)}
<!-- plateau marbre -->
<rect x="0" y="930" width="1000" height="320" fill="url(#surf)"/>
<rect x="0" y="930" width="1000" height="320" filter="url(#cloud)" opacity=".35"/>
<rect x="0" y="930" width="1000" height="320" filter="url(#marble)" opacity=".38"/>
<rect x="0" y="928" width="1000" height="4" fill="url(#gold)" opacity=".55"/>
<rect x="0" y="932" width="1000" height="40" fill="#000" opacity=".25" filter="url(#blur6)"/>`;
}

const leafShape = (fill = 'url(#leaf)') =>
  `<path d="M0 0C40-34 112-34 160 0C112 34 40 34 0 0Z" fill="${fill}"/><path d="M4 0C60-4 110-2 156 0" stroke="#173a22" stroke-width="2.5" fill="none" opacity=".7"/>`;

/* ───────────── accessoires ───────────── */
export const P = {
  leaf: (x, y, rot = 0, s = 1, blur = false) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" ${blur ? 'filter="url(#blur2)"' : ''}>${leafShape()}</g>`,
  blossom: (x, y, s = 1) => {
    let p = '';
    for (let a = 0; a < 360; a += 72) p += `<ellipse rx="13" ry="30" cy="-24" fill="url(#petal)" stroke="#d9cfb4" stroke-width=".8" transform="rotate(${a})"/>`;
    let dots = '';
    for (let a = 0; a < 360; a += 40) dots += `<circle cx="${Math.cos((a * Math.PI) / 180) * 12}" cy="${Math.sin((a * Math.PI) / 180) * 12}" r="2.6" fill="#d9a82e"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#soft)">${p}<circle r="10" fill="#e8c35a"/>${dots}</g>`;
  },
  almond: (x, y, rot = 0, s = 1) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" filter="url(#soft)"><path d="M0-34C20-27 25 12 0 34C-25 12-20-27 0-34Z" fill="url(#almond)"/><path d="M-6-20C-10 0-8 14-2 26M6-18C9 0 8 12 3 24" stroke="#5a2e12" stroke-width="1.4" fill="none" opacity=".5"/></g>`,
  argan: (x, y, rot = 0, s = 1) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" filter="url(#soft)"><ellipse rx="22" ry="30" fill="#8a6a2a"/><ellipse rx="22" ry="30" fill="url(#almond)" opacity=".6"/><ellipse cx="-6" cy="-10" rx="6" ry="10" fill="#fff" opacity=".18"/></g>`,
  pear: (x, y, s = 1) => {
    let d = '';
    for (let i = 0; i < 14; i++) d += `<circle cx="${r(-38, 38)}" cy="${r(-50, 50)}" r="2.2" fill="#f5d36a" opacity=".8"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#soft)"><ellipse rx="46" ry="60" fill="#9b2c4a"/><ellipse rx="46" ry="60" fill="url(#almond)" opacity=".25"/><ellipse cx="-14" cy="-20" rx="12" ry="22" fill="#fff" opacity=".15"/>${d}<ellipse cy="-58" rx="14" ry="5" fill="#5a1a2a"/></g>`;
  },
  comb: (x, y, s = 1) => {
    let cells = '';
    const h = 26, w = Math.sqrt(3) * h;
    for (let row = -3; row <= 3; row++)
      for (let col = -4; col <= 4; col++) {
        const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * h * 1.5;
        if ((cx * cx) / 1.6 + cy * cy * 1.4 > 9800) continue;
        const pts = [...Array(6)].map((_, k) => { const a = (Math.PI / 3) * k + Math.PI / 6; return `${cx + Math.cos(a) * h * 0.92},${cy + Math.sin(a) * h * 0.92}`; }).join(' ');
        cells += `<polygon points="${pts}" fill="url(#comb)" stroke="#8a5a0a" stroke-width="3"/><circle cx="${cx - 6}" cy="${cy - 7}" r="5" fill="#fff" opacity=".45"/>`;
      }
    return `<g transform="translate(${x} ${y}) scale(${s} ${s * 0.62})" filter="url(#soft)"><ellipse rx="135" ry="105" fill="#b9740f"/>${cells}</g>`;
  },
  dipper: (x, y, rot = -18, s = 1) => {
    let rings = '';
    for (let i = 0; i < 6; i++) rings += `<ellipse cx="${-150 - i * 16}" cy="0" rx="9" ry="${26 - Math.abs(i - 2.5) * 3}" fill="url(#wood)" stroke="#4a2a10" stroke-width="1"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" filter="url(#soft)">
      <rect x="-140" y="-9" width="300" height="18" rx="9" fill="url(#wood)"/>${rings}
      <path d="M-200 18C-196 40-206 52-198 70C-192 82-206 88-200 96" stroke="#e8a42a" stroke-width="12" stroke-linecap="round" fill="none" opacity=".92"/>
      <ellipse cx="-200" cy="100" rx="16" ry="8" fill="#d68f1c"/></g>`;
  },
  euca: (x, y, rot = 0, s = 1) => {
    let l = '';
    for (let i = 0; i < 7; i++) l += `<ellipse cx="${i * 34}" cy="${i % 2 ? 22 : -22}" rx="20" ry="17" fill="#7fa79a" stroke="#4f7a6a" stroke-width="1.5"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" filter="url(#soft)"><path d="M-10 0C80 -6 160 6 240 0" stroke="#6a4a3a" stroke-width="4" fill="none"/>${l}</g>`;
  },
  petals: (x, y) => {
    let p = '';
    for (let i = 0; i < 6; i++) p += `<ellipse cx="${x + r(-90, 90)}" cy="${y + r(-14, 14)}" rx="${r(10, 16)}" ry="${r(6, 9)}" transform="rotate(${r(0, 180)} ${x} ${y})" fill="#c2405a" opacity=".9"/>`;
    return `<g filter="url(#soft)">${p}</g>`;
  },
  bowl: (x, y, fill, s = 1, content = '') =>
    `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#soft)">
      <path d="M-120 -40C-116 30-60 60 0 60C60 60 116 30 120 -40Z" fill="url(#terracotta)"/>
      <ellipse cy="-40" rx="120" ry="26" fill="#6a2a14"/>
      <ellipse cy="-38" rx="108" ry="21" fill="${fill}"/>${content}
      <path d="M-100 -20C-90 10-60 30-20 36" stroke="#fff" stroke-width="5" opacity=".15" fill="none"/></g>`,
};

/* ───────────── étiquette ───────────── */
function label(w, h, title, sub, { dark = false, fs = 46 } = {}) {
  // Mise en page : petit ⵣ en haut · nom du produit au centre · « NADIA TIFAWT » en bas
  const bg = dark ? '#12291B' : '#F5F1E8', ink = dark ? '#F3E3B0' : '#12291B';
  const top = -h / 2, bot = h / 2;
  return `<g>
    <rect x="${-w / 2}" y="${top}" width="${w}" height="${h}" rx="12" fill="${bg}"/>
    <rect x="${-w / 2 + 10}" y="${top + 10}" width="${w - 20}" height="${h - 20}" rx="8" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <rect x="${-w / 2 + 16}" y="${top + 16}" width="${w - 32}" height="${h - 32}" rx="6" fill="none" stroke="#C5A059" stroke-width="1" opacity=".7"/>
    ${yaz(0, top + 58, 38, '#B8922E', 7)}
    <text y="${sub ? 14 : 22}" text-anchor="middle" font-family="Cormorant" font-weight="700" font-size="${fs}" letter-spacing="3" fill="${ink}">${title}</text>
    ${sub ? `<text y="${40}" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="11" letter-spacing="4" fill="#8B1E1E">${sub}</text>` : ''}
    <line x1="-46" x2="46" y1="${bot - 62}" y2="${bot - 62}" stroke="#C5A059" stroke-width="1.5"/>
    <circle cx="0" cy="${bot - 62}" r="2.6" fill="#B8922E"/>
    <text y="${bot - 34}" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="14" letter-spacing="6" fill="#B8922E">NADIA TIFAWT</text>
    <rect x="${-w / 2}" y="${top}" width="${w}" height="${h}" rx="12" fill="url(#labelShade)"/>
  </g>`;
}

/* ───────────── produits (origine = base, centre) ───────────── */
export function honeyJar(color, title, sub, { opaque = false, fs = 46 } = {}) {
  const id = 'h' + color.slice(1);
  return `
  <defs>
    <linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(color, 0.45)}"/><stop offset=".22" stop-color="${color}"/><stop offset=".5" stop-color="${shade(color, opaque ? 1.15 : 1.35)}"/><stop offset=".78" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, 0.4)}"/></linearGradient>
    <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${opaque ? 0.05 : 0.18}"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  </defs>
  <g filter="url(#soft)">
    <rect x="-190" y="-470" width="380" height="470" rx="74" fill="url(#${id})"/>
    <rect x="-190" y="-470" width="380" height="470" rx="74" fill="url(#${id}v)"/>
    ${opaque ? '' : `<ellipse cx="0" cy="-90" rx="120" ry="60" fill="${shade(color, 1.5)}" opacity=".35" filter="url(#blur14)"/>`}
    <rect x="-150" y="-430" width="24" height="380" rx="12" fill="#fff" opacity=".32" filter="url(#blur2)"/>
    <rect x="128" y="-420" width="10" height="340" rx="5" fill="#fff" opacity=".22" filter="url(#blur2)"/>
    <rect x="-178" y="-500" width="356" height="40" rx="10" fill="#fff" opacity=".18"/>
    <rect x="-178" y="-500" width="356" height="40" rx="10" fill="url(#edgeShade)"/>
    <rect x="-190" y="-590" width="380" height="96" rx="16" fill="url(#gold)"/>
    ${[...Array(30)].map((_, i) => `<rect x="${-182 + i * 12.4}" y="-584" width="4" height="84" fill="#000" opacity=".1"/>`).join('')}
    <rect x="-190" y="-590" width="380" height="16" rx="8" fill="#fff" opacity=".25"/>
    <rect x="-190" y="-508" width="380" height="10" fill="#5a420e" opacity=".55"/>
  </g>
  <g transform="translate(0 -235)">${label(300, 250, title, sub, { fs })}</g>`;
}

export function creamJar(title, sub, { body = '#F5F1E8', glass = false } = {}) {
  const id = 'c' + body.slice(1);
  return `
  <defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(body, 0.62)}"/><stop offset=".3" stop-color="${body}"/><stop offset=".45" stop-color="${shade(body, 1.4)}"/><stop offset=".75" stop-color="${body}"/><stop offset="1" stop-color="${shade(body, 0.55)}"/></linearGradient></defs>
  <g filter="url(#soft)">
    <rect x="-240" y="-290" width="480" height="290" rx="46" fill="url(#${id})"/>
    ${glass ? `<rect x="-200" y="-260" width="20" height="230" rx="10" fill="#fff" opacity=".3" filter="url(#blur2)"/>` : `<rect x="-200" y="-270" width="16" height="250" rx="8" fill="#fff" opacity=".55" filter="url(#blur2)"/>`}
    <rect x="-252" y="-410" width="504" height="130" rx="26" fill="url(#gold)"/>
    <rect x="-252" y="-410" width="504" height="22" rx="11" fill="#fff" opacity=".3"/>
    <rect x="-252" y="-296" width="504" height="14" fill="#5a420e" opacity=".55"/>
  </g>
  ${glass
    ? `<g transform="translate(0 -145)">${label(300, 210, title, sub, { fs: title.length > 8 ? 33 : 40 })}</g>`
    : `<g>${yaz(0, -200, 64, '#B8922E', 7)}
       <text y="-110" text-anchor="middle" font-family="Cormorant" font-weight="700" font-size="50" letter-spacing="4" fill="#12291B">${title}</text>
       ${sub ? `<text y="-76" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="13" letter-spacing="6" fill="#8B1E1E">${sub}</text>` : `<line x1="-50" x2="50" y1="-80" y2="-80" stroke="#C5A059" stroke-width="1.6"/><circle cy="-80" r="2.8" fill="#B8922E"/>`}
       <text y="-42" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="13" letter-spacing="7" fill="#B8922E">NADIA TIFAWT</text></g>`}`;
}

export function bottle(color, title, sub) {
  const id = 'b' + color.slice(1);
  return `
  <defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(color, 0.4)}"/><stop offset=".25" stop-color="${color}"/><stop offset=".45" stop-color="${shade(color, 1.35)}"/><stop offset=".75" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, 0.35)}"/></linearGradient></defs>
  <g filter="url(#soft)">
    <path d="M-150 -40V-470C-150-530-110-560-60-575V-610H60V-575C110-560 150-530 150-470V-40C150-15 130 0 105 0H-105C-130 0-150-15-150-40Z" fill="url(#${id})"/>
    <rect x="-120" y="-500" width="20" height="440" rx="10" fill="#fff" opacity=".3" filter="url(#blur2)"/>
    <rect x="-72" y="-700" width="144" height="100" rx="12" fill="url(#gold)"/>
    ${[...Array(10)].map((_, i) => `<rect x="${-66 + i * 14}" y="-694" width="4" height="88" fill="#000" opacity=".12"/>`).join('')}
    <path d="M-46 -700V-800C-46-850 46-850 46-800V-700Z" fill="#1a2a1e"/>
    <path d="M-30 -710V-800C-30-830-16-838-10-838" stroke="#fff" stroke-width="6" opacity=".15" fill="none"/>
  </g>
  <g transform="translate(0 -270)">${label(240, 280, title, sub, { fs: 40 })}</g>`;
}

export function soapBowl() {
  let swirl = '';
  for (let i = 0; i < 4; i++) swirl += `<path d="M${-80 + i * 30} ${-38 + (i % 2) * 6}c20-14 40-14 60 0" stroke="#7a6a2a" stroke-width="3" fill="none" opacity=".6"/>`;
  return `${P.bowl(0, -80, '#2e2a12', 2.1, swirl + '<ellipse cx="-30" cy="-44" rx="40" ry="6" fill="#fff" opacity=".25"/>')}
  <g transform="translate(0 -300)">${label(270, 200, 'SAVON NOIR', 'BELDI · HAMMAM', { fs: 38 })}</g>`;
}

/* ───────────── scène complète ───────────── */
export function scene({ product, props = '', back = '', accent = '#D4AF37', s = 1, seedN = 1 }) {
  seed = seedN * 9301 + 7;
  const prod = `<g transform="translate(500 1040) scale(${s})">${product}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="1000" height="1250">
  <defs>${DEFS}</defs>
  ${background(accent)}
  ${back}
  <ellipse cx="500" cy="1046" rx="${250 * s}" ry="26" fill="#000" opacity=".6" filter="url(#blur14)"/>
  <g mask="url(#reflMask)"><g transform="translate(0 2080) scale(1 -1)">${prod}</g></g>
  ${prod}
  ${props}
  <rect width="1000" height="1250" filter="url(#grain)"/>
  <rect width="1000" height="1250" fill="url(#bg)" opacity="0"/>
</svg>`;
}
