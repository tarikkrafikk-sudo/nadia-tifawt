// Emblème NADIA TIFAWT — jeune femme amazighe, style illustration anime.
// Création originale, vectorielle (viewBox 512×512).
import { YAZ } from './scene.mjs';

const yazG = (cx, cy, s, color, sw = 9) =>
  `<g transform="translate(${cx - s / 2} ${cy - s / 2}) scale(${s / 100})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"><path d="${YAZ}"/></g>`;

const coins = (pts, r = 5.5) => pts.map(([x, y]) => `<line x1="${x}" y1="${y - 9}" x2="${x}" y2="${y - r}" stroke="#b8922e" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gGold)" stroke="#8f6f1f" stroke-width="1"/><circle cx="${x - 1.6}" cy="${y - 1.6}" r="${r * 0.35}" fill="#fff8d8" opacity=".8"/>`).join('');

export function girlSVG({ frame = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <radialGradient id="gBg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#2f6a45"/><stop offset=".55" stop-color="#173a24"/><stop offset="1" stop-color="#0b1a11"/></radialGradient>
  <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4c8"/><stop offset=".35" stop-color="#e2c06a"/><stop offset=".6" stop-color="#b8922e"/><stop offset="1" stop-color="#f3e3b0"/></linearGradient>
  <linearGradient id="gRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4c8"/><stop offset=".25" stop-color="#d4af37"/><stop offset=".5" stop-color="#8f6f1f"/><stop offset=".75" stop-color="#f3e3b0"/><stop offset="1" stop-color="#b8922e"/></linearGradient>
  <linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d2b4"/><stop offset="1" stop-color="#e9b28e"/></linearGradient>
  <linearGradient id="gNeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf9572"/><stop offset=".35" stop-color="#e6ad88"/><stop offset="1" stop-color="#eebb98"/></linearGradient>
  <linearGradient id="gHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2216"/><stop offset="1" stop-color="#1c0f0a"/></linearGradient>
  <linearGradient id="gScarf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset=".6" stop-color="#efe5cf"/><stop offset="1" stop-color="#d9caa8"/></linearGradient>
  <linearGradient id="gDress" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f5a35"/><stop offset="1" stop-color="#0f2c1a"/></linearGradient>
  <radialGradient id="gIris" cx="50%" cy="65%" r="60%"><stop offset="0" stop-color="#f3c35a"/><stop offset=".55" stop-color="#b8741c"/><stop offset="1" stop-color="#5a2c0c"/></radialGradient>
  <radialGradient id="gBlush" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f28b7a" stop-opacity=".55"/><stop offset="1" stop-color="#f28b7a" stop-opacity="0"/></radialGradient>
  <radialGradient id="gGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#d4af37" stop-opacity=".35"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></radialGradient>
  <pattern id="gBand" width="28" height="14" patternUnits="userSpaceOnUse">
    <rect width="28" height="14" fill="#f5efe0"/>
    <path d="M0 7L7 0L14 7L7 14Z" fill="#8B1E1E"/><path d="M4 7L7 4L10 7L7 10Z" fill="#f5efe0"/>
    <path d="M14 7L21 0L28 7L21 14Z" fill="#1f5a35"/><circle cx="21" cy="7" r="2" fill="#d4af37"/>
  </pattern>
  <pattern id="gMotif" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
    <path d="M22 8L30 22L22 36L14 22Z" fill="none" stroke="#8B1E1E" stroke-width="2.4" opacity=".55"/>
    <path d="M22 16L26 22L22 28L18 22Z" fill="#1f5a35" opacity=".45"/>
    <path d="M2 2L6 6M42 42L38 38M42 2L38 6M2 42L6 38" stroke="#8B1E1E" stroke-width="2" opacity=".4"/>
  </pattern>
  <clipPath id="gCircle"><circle cx="256" cy="256" r="${frame ? 236 : 256}"/></clipPath>
  <clipPath id="gEyeL"><path d="M196 264Q218 240 248 254Q246 284 222 288Q200 284 196 264Z"/></clipPath>
  <clipPath id="gEyeR"><path d="M316 264Q294 240 264 254Q266 284 290 288Q312 284 316 264Z"/></clipPath>
  <filter id="gSoft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="gBlur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>

<g clip-path="url(#gCircle)">
  <rect width="512" height="512" fill="url(#gBg)"/>
  <circle cx="256" cy="250" r="190" fill="url(#gGlow)"/>
  <!-- Atlas -->
  <path d="M0 400L70 330L110 360L170 290L230 350L256 330L300 360L350 300L410 350L450 320L512 380V512H0Z" fill="#0d2416" opacity=".9"/>
  <path d="M170 290L190 312L178 310L200 330M350 300L368 322L356 320L376 338" stroke="#d4af37" stroke-width="2" fill="none" opacity=".45"/>
  ${yazG(440, 130, 46, '#d4af37', 9)}
  <circle cx="90" cy="120" r="10" fill="#f3e3b0" opacity=".25" filter="url(#gBlur)"/><circle cx="420" cy="230" r="14" fill="#d4af37" opacity=".22" filter="url(#gBlur)"/>

  <!-- buste / robe -->
  <path d="M84 512C96 432 168 404 228 396L284 396C344 404 416 432 428 512Z" fill="url(#gDress)"/>
  <path d="M206 400Q256 470 306 400" fill="none" stroke="url(#gGold)" stroke-width="7"/>
  <path d="M214 404Q256 458 298 404" fill="none" stroke="#8B1E1E" stroke-width="3" stroke-dasharray="6 5"/>

  <!-- cou -->
  <path d="M234 330L232 398Q256 414 280 398L278 330Z" fill="url(#gNeck)"/>
  <path d="M234 340Q256 368 278 340L278 326L234 326Z" fill="#c98868" opacity=".6"/>
  <!-- collier -->
  <path d="M228 388Q256 414 284 388" fill="none" stroke="url(#gGold)" stroke-width="3.5"/>
  ${coins([[238, 402], [248, 407], [264, 407], [274, 402]], 4.5)}
  <circle cx="256" cy="424" r="14" fill="url(#gGold)" stroke="#8f6f1f" stroke-width="1.5"/>
  ${yazG(256, 424, 16, '#6e5010', 12)}

  <!-- cheveux dans l'ouverture du foulard -->
  <path d="M182 262C182 200 210 150 256 148C302 150 330 200 330 262C330 304 322 340 318 380C300 392 290 360 286 330L226 330C222 360 212 392 194 380C190 340 182 304 182 262Z" fill="url(#gHair)"/>
  <path d="M196 300C194 340 200 380 214 404M316 300C318 340 312 380 298 404" stroke="#2a170e" stroke-width="10" stroke-linecap="round" fill="none"/>

  <!-- visage -->
  <path d="M188 246C188 300 206 334 236 352Q256 364 276 352C306 334 324 300 324 246C324 194 296 168 256 168C216 168 188 194 188 246Z" fill="url(#gSkin)"/>
  <path d="M188 256C194 304 212 334 238 350Q256 362 272 352C252 356 230 340 216 316C202 294 194 274 188 256Z" fill="#e3a483" opacity=".45"/>
  <!-- ombre sous la frange -->
  

  <!-- frange -->
  <path d="M186 254C184 202 212 166 256 164C300 166 328 202 326 254Q318 232 314 222Q312 244 304 256Q302 228 290 210Q290 236 276 248Q280 222 270 200Q262 228 244 242Q252 222 248 202Q236 230 220 244Q224 226 226 214Q210 232 202 254Q200 236 198 228Q190 240 186 254Z" fill="url(#gHair)"/>
  <path d="M226 190Q256 176 290 188M212 206Q220 194 232 188" stroke="#7a5038" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/>

  <!-- foulard amazigh -->
  <g filter="url(#gSoft)">
    <path id="scarf" d="M256 92C166 92 120 158 120 246C120 320 104 384 62 444C50 466 50 494 56 512L188 512C194 470 198 420 194 372C190 332 180 300 180 260C180 198 210 146 256 144C302 146 332 198 332 260C332 300 322 332 318 372C314 420 318 470 324 512L456 512C462 494 462 466 450 444C408 384 392 320 392 246C392 158 346 92 256 92Z" fill="url(#gScarf)"/>
    <path d="M256 92C166 92 120 158 120 246C120 320 104 384 62 444C50 466 50 494 56 512L188 512C194 470 198 420 194 372C190 332 180 300 180 260C180 198 210 146 256 144C302 146 332 198 332 260C332 300 322 332 318 372C314 420 318 470 324 512L456 512C462 494 462 466 450 444C408 384 392 320 392 246C392 158 346 92 256 92Z" fill="url(#gMotif)"/>
    <path d="M150 180C138 260 140 340 112 430M362 180C374 260 372 340 400 430M200 110C226 102 286 102 312 110" stroke="#b8a582" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>
    <path d="M120 246C120 320 104 384 62 444C50 466 50 494 56 512L120 512C150 430 160 330 160 250Z" fill="#8a7650" opacity=".18"/>
    <path d="M392 246C392 320 408 384 450 444C462 466 462 494 456 512L392 512C362 430 352 330 352 250Z" fill="#8a7650" opacity=".18"/>
    <path d="M188 512C194 470 198 420 194 372C190 332 180 300 180 260C180 198 210 146 256 144C302 146 332 198 332 260C332 300 322 332 318 372C314 420 318 470 324 512" fill="none" stroke="url(#gBand)" stroke-width="18"/>
    <path d="M176 512C182 470 186 420 182 372C178 332 168 300 168 260C168 190 202 132 256 130C310 132 344 190 344 260C344 300 334 332 330 372C326 420 330 470 336 512" fill="none" stroke="url(#gGold)" stroke-width="2.6"/>
  </g>

  <!-- diadème (tabzimt) -->
  <path d="M192 206Q256 166 320 206" fill="none" stroke="url(#gGold)" stroke-width="3.2"/>
  ${coins([[204, 210], [218, 200], [234, 192], [278, 192], [294, 200], [308, 210]], 4.6)}
  <path d="M256 168L266 180L256 194L246 180Z" fill="#8B1E1E" stroke="url(#gGold)" stroke-width="2.6"/>
  <circle cx="253" cy="177" r="2.2" fill="#fff" opacity=".75"/>
  ${coins([[256, 206]], 5)}

  <!-- sourcils -->
  <path d="M198 240Q216 228 240 231" stroke="#3a2216" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M314 240Q296 228 272 231" stroke="#3a2216" stroke-width="3.2" fill="none" stroke-linecap="round"/>

  <!-- yeux -->
  ${['L', 'R'].map((s) => {
    const X = (x) => (s === 'L' ? x : 512 - x);
    const m = s === 'L' ? 1 : -1, cx = X(224);
    const eye = `M${X(196)} 264Q${X(218)} 240 ${X(248)} 254Q${X(246)} 284 ${X(222)} 288Q${X(200)} 284 ${X(196)} 264Z`;
    return `
    <path d="${eye}" fill="#fffaf2"/>
    <g clip-path="url(#gEye${s})">
      <ellipse cx="${cx}" cy="268" rx="15" ry="19" fill="url(#gIris)"/>
      <ellipse cx="${cx}" cy="268" rx="15" ry="19" fill="none" stroke="#4a2408" stroke-width="2"/>
      <ellipse cx="${cx}" cy="270" rx="7" ry="10" fill="#2a1406"/>
      <path d="M${cx - 16} 256Q${cx} 248 ${cx + 16} 256" stroke="#3a1a06" stroke-width="7" fill="none" opacity=".5"/>
      <circle cx="${cx + 5 * m}" cy="261" r="5.4" fill="#fff"/>
      <circle cx="${cx - 6 * m}" cy="277" r="2.6" fill="#fff" opacity=".9"/>
    </g>
    <path d="M${X(192)} 264Q${X(216)} 236 ${X(250)} 253" stroke="#1c0f0a" stroke-width="5.2" fill="none" stroke-linecap="round"/>
    <path d="M${X(193)} 263L${X(185)} 258M${X(197)} 255L${X(189)} 248M${X(204)} 248L${X(199)} 241" stroke="#1c0f0a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M${X(198)} 247Q${X(218)} 230 ${X(244)} 241" stroke="#9a6a50" stroke-width="1.4" fill="none" opacity=".6"/>
    <path d="M${X(204)} 284Q${X(222)} 292 ${X(240)} 282" stroke="#8a5a40" stroke-width="1.6" fill="none" opacity=".7"/>`;
  }).join('')}

  <!-- joues, nez, bouche -->
  <ellipse cx="208" cy="304" rx="20" ry="10" fill="url(#gBlush)"/>
  <ellipse cx="304" cy="304" rx="20" ry="10" fill="url(#gBlush)"/>
  <path d="M259 296Q263 304 255 307" stroke="#c78462" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M242 323Q256 336 270 323Q256 330 242 323Z" fill="#c4525a"/>
  <path d="M242 323Q256 327 270 323" stroke="#9a3a42" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="259" cy="330" rx="4" ry="1.4" fill="#fff" opacity=".4"/>

  <!-- boucles d'oreilles -->
  ${[[184, 312], [328, 312]].map(([x, y]) => `<line x1="${x}" y1="${y - 14}" x2="${x}" y2="${y - 6}" stroke="#b8922e" stroke-width="1.6"/><circle cx="${x}" cy="${y + 5}" r="12" fill="#12291B" stroke="url(#gGold)" stroke-width="3"/>${yazG(x, y + 5, 12, '#d4af37', 12)}${coins([[x - 9, y + 25], [x, y + 30], [x + 9, y + 25]], 3.6)}`).join('')}
</g>
${frame ? `
<circle cx="256" cy="256" r="240" fill="none" stroke="url(#gRing)" stroke-width="10"/>
<circle cx="256" cy="256" r="230" fill="none" stroke="#f3e3b0" stroke-width="1.2" opacity=".6"/>
<circle cx="256" cy="256" r="250" fill="none" stroke="#b8922e" stroke-width="1.5" opacity=".7"/>` : ''}
</svg>`;
}
