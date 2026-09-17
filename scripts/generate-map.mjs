/**
 * Génère la carte fictive du Comté de Karnstein (public/carte/comte-karnstein.svg).
 *
 * Le rendu est déterministe : un PRNG à graine fixe place les forêts, les
 * collines et les reliefs. Relancer `npm run carte` produit exactement le même
 * fichier, ce qui garde les coordonnées des marqueurs (src/lib/domaine.ts)
 * valides d'une génération à l'autre.
 *
 * Repère : coordonnées SVG classiques, origine en haut à gauche,
 * 2400 x 1600 unités pour l'ensemble du comté.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WIDTH = 2400;
const HEIGHT = 1600;

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/carte/comte-karnstein.svg",
);

/** PRNG mulberry32 : rapide, suffisant, et surtout reproductible. */
function makeRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = makeRandom(0x4b41524e); // "KARN"
const between = (min, max) => min + rand() * (max - min);
const round = (n) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------ */
/* Semis de motifs dans des zones elliptiques                          */
/* ------------------------------------------------------------------ */

const inEllipse = (x, y, e) =>
  ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2 <= 1;

/**
 * Tire `count` points dans l'union de `zones`, en évitant `blockers`
 * et en respectant une distance minimale entre points.
 */
function scatter(zones, count, { minDist = 26, blockers = [] } = {}) {
  const points = [];
  let guard = 0;
  while (points.length < count && guard < count * 240) {
    guard += 1;
    const zone = zones[Math.floor(rand() * zones.length)];
    const x = between(zone.cx - zone.rx, zone.cx + zone.rx);
    const y = between(zone.cy - zone.ry, zone.cy + zone.ry);
    if (!inEllipse(x, y, zone)) continue;
    if (blockers.some((b) => inEllipse(x, y, b))) continue;
    if (points.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < minDist ** 2)) {
      continue;
    }
    points.push({ x, y, s: between(0.75, 1.35) });
  }
  return points.sort((a, b) => a.y - b.y);
}

/* ------------------------------------------------------------------ */
/* Glyphes                                                             */
/* ------------------------------------------------------------------ */

/** Conifère stylisé, à l'encre, comme sur une carte de cartographe. */
function conifer({ x, y, s }) {
  const h = 30 * s;
  const w = 11 * s;
  const tiers = [0, 0.3, 0.6]
    .map((t) => {
      const ty = y - h * (1 - t);
      const tw = w * (0.45 + t * 0.55);
      return `M${round(x - tw)} ${round(ty + h * 0.26)}L${round(x)} ${round(ty)}L${round(x + tw)} ${round(ty + h * 0.26)}Z`;
    })
    .join("");
  return `<path d="${tiers}" fill="url(#g-foret)" stroke="#0c1410" stroke-width="${round(0.9 * s)}"/><path d="M${round(x)} ${round(y)}v${round(-h * 0.22)}" stroke="#0c1410" stroke-width="${round(1.6 * s)}"/>`;
}

/** Feuillu : une touffe de trois lobes. */
function broadleaf({ x, y, s }) {
  const r = 11 * s;
  return `<path d="M${round(x)} ${round(y)}v${round(-r * 0.9)}" stroke="#0c1410" stroke-width="${round(1.6 * s)}"/><circle cx="${round(x - r * 0.55)}" cy="${round(y - r * 1.15)}" r="${round(r * 0.72)}" fill="url(#g-foret)" stroke="#0c1410" stroke-width="${round(0.9 * s)}"/><circle cx="${round(x + r * 0.55)}" cy="${round(y - r * 1.15)}" r="${round(r * 0.72)}" fill="url(#g-foret)" stroke="#0c1410" stroke-width="${round(0.9 * s)}"/><circle cx="${round(x)} " cy="${round(y - r * 1.7)}" r="${round(r * 0.8)}" fill="url(#g-foret)" stroke="#0c1410" stroke-width="${round(0.9 * s)}"/>`;
}

/** Sommet : un versant éclairé, un versant à l'ombre. */
function peak({ x, y, s }) {
  const h = 92 * s;
  const w = 74 * s;
  return [
    `<path d="M${round(x - w)} ${round(y)}L${round(x)} ${round(y - h)}L${round(x + w)} ${round(y)}Z" fill="#241a1c" stroke="#0d0709" stroke-width="2.2"/>`,
    `<path d="M${round(x)} ${round(y - h)}L${round(x + w)} ${round(y)}L${round(x + w * 0.16)} ${round(y)}Z" fill="#150e10"/>`,
    `<path d="M${round(x - w * 0.34)} ${round(y - h * 0.62)}L${round(x)} ${round(y - h)}L${round(x + w * 0.3)} ${round(y - h * 0.6)}L${round(x + w * 0.1)} ${round(y - h * 0.72)}L${round(x - w * 0.1)} ${round(y - h * 0.66)}Z" fill="#6d5a52" opacity="0.65"/>`,
  ].join("");
}

/** Colline : simple arc doublé d'un trait de renfort. */
function hill({ x, y, s }) {
  const w = 46 * s;
  const h = 20 * s;
  return `<path d="M${round(x - w)} ${round(y)}q${round(w * 0.55)} ${round(-h * 1.5)} ${round(w)} 0" fill="none" stroke="#3a2a2a" stroke-width="${round(2.4 * s)}" stroke-linecap="round"/><path d="M${round(x - w * 0.2)} ${round(y)}q${round(w * 0.45)} ${round(-h * 1.15)} ${round(w * 0.9)} 0" fill="none" stroke="#2c1f20" stroke-width="${round(1.8 * s)}" stroke-linecap="round"/>`;
}

/** Touffe de roseaux, pour les marécages. */
function reed({ x, y, s }) {
  const h = 16 * s;
  return `<path d="M${round(x)} ${round(y)}l${round(-4 * s)} ${round(-h)}M${round(x)} ${round(y)}l${round(2 * s)} ${round(-h * 1.15)}M${round(x)} ${round(y)}l${round(6 * s)} ${round(-h * 0.8)}" stroke="#3f4a3c" stroke-width="${round(1.7 * s)}" stroke-linecap="round" fill="none"/>`;
}

/* ------------------------------------------------------------------ */
/* Géographie du comté                                                 */
/* ------------------------------------------------------------------ */

// Silhouette des terres comtales (le reste est « hors fief »).
const TERRES =
  "M120 300 L360 176 L700 140 L1080 190 L1420 132 L1780 176 L2090 150 L2286 270 " +
  "L2300 640 L2220 980 L2286 1270 L2060 1450 L1700 1488 L1340 1436 L980 1492 " +
  "L620 1444 L300 1470 L128 1300 L172 980 L104 640 Z";

// La Sanguine : née des Crocs Gris, elle traverse le lac et gagne les marais.
const SANGUINE =
  "M2180 214 C2010 330 1900 386 1720 440 C1560 488 1420 512 1240 596 " +
  "C1130 648 1046 700 986 742";
const SANGUINE_AVAL =
  "M700 828 C614 888 560 946 500 1046 C444 1140 392 1234 300 1330";

// L'Ombrelle : affluent descendu de la Sylve.
const OMBRELLE =
  "M1980 900 C1820 906 1700 862 1560 846 C1400 828 1240 868 1120 906 " +
  "C1040 930 980 940 900 936";

const LAC = { cx: 842, cy: 786, rx: 176, ry: 108 };

const FORETS = [
  { cx: 1780, cy: 760, rx: 420, ry: 300 },
  { cx: 1420, cy: 1150, rx: 330, ry: 210 },
  { cx: 2060, cy: 1210, rx: 230, ry: 170 },
];

const MARAIS = { cx: 420, cy: 1256, rx: 250, ry: 150 };

const COLLINES = [
  { cx: 700, cy: 520, rx: 420, ry: 150 },
  { cx: 1300, cy: 470, rx: 380, ry: 120 },
  { cx: 560, cy: 1020, rx: 300, ry: 130 },
];

const CRETE = [
  { x: 260, y: 336, s: 0.95 },
  { x: 430, y: 310, s: 1.2 },
  { x: 620, y: 292, s: 0.9 },
  { x: 840, y: 276, s: 1.1 },
  { x: 1060, y: 298, s: 0.85 },
  { x: 1300, y: 268, s: 1.25 },
  { x: 1560, y: 286, s: 1.0 },
  { x: 1810, y: 262, s: 1.15 },
  { x: 2050, y: 292, s: 0.9 },
  { x: 2230, y: 330, s: 1.05 },
];

const ROUTES = [
  // Voie comtale : de la marche ouest au Castel, via le Pont des Gargouilles.
  "M120 1150 C320 1074 480 970 620 895 C760 884 946 858 1040 790 C1090 754 1132 724 1160 700",
  // Descente du Castel vers le bourg, la forge puis le camp de chasse.
  "M1160 700 C1198 772 1218 906 1230 990 C1250 1030 1270 1048 1300 1060 C1382 1098 1442 1140 1500 1180",
  // Chemin des vignes : le bourg, les coteaux, puis la lisière de la Sylve.
  "M1230 990 C1330 952 1470 930 1560 950 C1664 928 1772 858 1850 780",
  // Sentier des carrières, par le col du Guet.
  "M1160 700 C1268 628 1424 556 1560 520 C1672 468 1752 422 1810 400 C1872 412 1928 432 1960 452",
  // Voie des morts : du Castel à la crypte des aïeux.
  "M1160 700 C1128 646 1068 558 1020 470",
  // Piste du marais, vers le moulin de Cendrefeuille.
  "M620 895 C608 992 590 1182 560 1290",
  // Amorce vers la chapelle et vers l'embarcadère du lac.
  "M1230 990 C1278 962 1312 924 1330 900",
  "M706 874 C690 842 680 814 676 800",
];

/* ------------------------------------------------------------------ */
/* Assemblage                                                          */
/* ------------------------------------------------------------------ */

const coniferes = scatter(FORETS, 210, { minDist: 46, blockers: [LAC] })
  .map(conifer)
  .join("");
const feuillus = scatter(FORETS, 120, { minDist: 52, blockers: [LAC] })
  .map(broadleaf)
  .join("");
const collines = scatter(COLLINES, 46, { minDist: 92, blockers: [LAC] })
  .map(hill)
  .join("");
const roseaux = scatter([MARAIS], 60, { minDist: 34 }).map(reed).join("");
const sommets = CRETE.map(peak).join("");

const routes = ROUTES.map(
  (d) =>
    `<path d="${d}" fill="none" stroke="#0e0709" stroke-width="8" stroke-linecap="round" opacity="0.5"/>` +
    `<path d="${d}" fill="none" stroke="#7d5f42" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="14 12" opacity="0.85"/>`,
).join("");

const rivieres = [SANGUINE, SANGUINE_AVAL, OMBRELLE]
  .map(
    (d, i) =>
      `<path d="${d}" fill="none" stroke="#0a1418" stroke-width="${i === 2 ? 13 : 19}" stroke-linecap="round" opacity="0.7"/>` +
      `<path d="${d}" fill="none" stroke="url(#g-eau)" stroke-width="${i === 2 ? 8 : 12}" stroke-linecap="round"/>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" font-family="Georgia, 'Times New Roman', serif">
  <title>Carte du Comté de Karnstein</title>
  <defs>
    <radialGradient id="g-parchemin" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#241a17"/>
      <stop offset="55%" stop-color="#1a1214"/>
      <stop offset="100%" stop-color="#0d0809"/>
    </radialGradient>
    <linearGradient id="g-terre" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2e2220"/>
      <stop offset="100%" stop-color="#1d1516"/>
    </linearGradient>
    <linearGradient id="g-eau" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3c5f6b"/>
      <stop offset="100%" stop-color="#22414c"/>
    </linearGradient>
    <linearGradient id="g-foret" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2b3b2e"/>
      <stop offset="100%" stop-color="#16211a"/>
    </linearGradient>
    <linearGradient id="g-sang" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5c1118"/>
      <stop offset="50%" stop-color="#9d2028"/>
      <stop offset="100%" stop-color="#5c1118"/>
    </linearGradient>
    <filter id="f-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="17" result="bruit"/>
      <feColorMatrix in="bruit" type="saturate" values="0"/>
    </filter>
    <filter id="f-cotes" x="-12%" y="-12%" width="124%" height="124%">
      <feGaussianBlur stdDeviation="9" result="flou"/>
      <feBlend in="SourceGraphic" in2="flou"/>
    </filter>
    <pattern id="p-marais" width="26" height="18" patternUnits="userSpaceOnUse">
      <path d="M0 9h14M6 15h16" stroke="#31424a" stroke-width="1.8" opacity="0.75"/>
    </pattern>
  </defs>

  <!-- Fond de parchemin -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g-parchemin)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" filter="url(#f-grain)" opacity="0.22" style="mix-blend-mode:overlay"/>

  <!-- Graticule -->
  <g stroke="#7a5b3f" stroke-width="0.8" opacity="0.13">
    ${Array.from({ length: 11 }, (_, i) => `<path d="M${(i + 1) * 200} 0v${HEIGHT}"/>`).join("")}
    ${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${(i + 1) * 200}h${WIDTH}"/>`).join("")}
  </g>

  <!-- Terres du comté -->
  <g>
    <path d="${TERRES}" fill="#0a0506" filter="url(#f-cotes)" opacity="0.85"/>
    <path d="${TERRES}" fill="url(#g-terre)" stroke="#5a4130" stroke-width="3"/>
  </g>

  <!-- Marais de Cendrefeuille -->
  <g>
    <ellipse cx="${MARAIS.cx}" cy="${MARAIS.cy}" rx="${MARAIS.rx}" ry="${MARAIS.ry}" fill="#1b2724" opacity="0.9"/>
    <ellipse cx="${MARAIS.cx}" cy="${MARAIS.cy}" rx="${MARAIS.rx}" ry="${MARAIS.ry}" fill="url(#p-marais)" opacity="0.5"/>
    ${roseaux}
  </g>

  <!-- Lac Vermeil -->
  <g>
    <ellipse cx="${LAC.cx}" cy="${LAC.cy}" rx="${LAC.rx + 8}" ry="${LAC.ry + 8}" fill="#0a1418" opacity="0.8"/>
    <ellipse cx="${LAC.cx}" cy="${LAC.cy}" rx="${LAC.rx}" ry="${LAC.ry}" fill="url(#g-eau)"/>
    <ellipse cx="${LAC.cx}" cy="${LAC.cy}" rx="${LAC.rx * 0.72}" ry="${LAC.ry * 0.68}" fill="none" stroke="#5a8390" stroke-width="1.4" opacity="0.35"/>
    <ellipse cx="${LAC.cx}" cy="${LAC.cy}" rx="${LAC.rx * 0.44}" ry="${LAC.ry * 0.4}" fill="none" stroke="#5a8390" stroke-width="1.2" opacity="0.25"/>
  </g>

  <!-- Cours d'eau -->
  <g>${rivieres}</g>

  <!-- Reliefs -->
  <g>${collines}</g>
  <g>${sommets}</g>

  <!-- Sylve des Murmures -->
  <g>${coniferes}${feuillus}</g>

  <!-- Routes et sentiers -->
  <g>${routes}</g>

  <!-- Frontière du fief -->
  <path d="${TERRES}" fill="none" stroke="url(#g-sang)" stroke-width="5" stroke-dasharray="26 12 4 12" opacity="0.8"/>

  <!-- Toponymes gravés à même la carte -->
  <g fill="#c8b79a" opacity="0.72" font-style="italic" text-anchor="middle">
    <text x="1180" y="212" font-size="46" letter-spacing="14">LES CROCS GRIS</text>
    <text x="1840" y="640" font-size="40" letter-spacing="10">SYLVE DES MURMURES</text>
    <text x="842" y="${LAC.cy + 8}" font-size="30" letter-spacing="7" fill="#9fc0cb">Lac Vermeil</text>
    <text x="420" y="1256" font-size="28" letter-spacing="6" fill="#8ea08f">Marais de Cendrefeuille</text>
    <text x="1660" y="1330" font-size="28" letter-spacing="6">Bois du Pendu</text>
    <text x="640" y="560" font-size="28" letter-spacing="6">Hautes Landes</text>
    <text x="1120" y="640" font-size="24" letter-spacing="5" transform="rotate(-21 1120 640)" fill="#8fb1bd">la Sanguine</text>
  </g>

  <!-- Rose des vents -->
  <g transform="translate(232 1340)" opacity="0.85">
    <circle r="86" fill="#0d0809" stroke="#7d5c3c" stroke-width="2"/>
    <circle r="66" fill="none" stroke="#7d5c3c" stroke-width="1" opacity="0.6"/>
    <path d="M0 -78L17 -14L0 0L-17 -14Z" fill="#9d2028"/>
    <path d="M0 78L17 14L0 0L-17 14Z" fill="#3a2a22"/>
    <path d="M-78 0L-14 -17L0 0L-14 17Z" fill="#6b4c33"/>
    <path d="M78 0L14 -17L0 0L14 17Z" fill="#6b4c33"/>
    <text x="0" y="-94" font-size="26" fill="#c8b79a" text-anchor="middle">N</text>
  </g>

  <!-- Échelle -->
  <g transform="translate(1980 1450)" fill="#c8b79a">
    <rect x="0" y="0" width="90" height="12" fill="#c8b79a"/>
    <rect x="90" y="0" width="90" height="12" fill="#3a2a22" stroke="#c8b79a" stroke-width="1.5"/>
    <rect x="180" y="0" width="90" height="12" fill="#c8b79a"/>
    <text x="0" y="-12" font-size="22" letter-spacing="3">0</text>
    <text x="252" y="-12" font-size="22" letter-spacing="3">3 lieues</text>
  </g>

  <!-- Cartouche -->
  <g transform="translate(1180 1524)" text-anchor="middle">
    <rect x="-430" y="-40" width="860" height="82" rx="3" fill="#0b0607" stroke="#5a1520" stroke-width="1.5" opacity="0.94"/>
    <text y="-4" font-size="34" fill="#a9202a" letter-spacing="12">COMITATUS KARNSTEIN</text>
    <text y="28" font-size="19" fill="#8a7a62" letter-spacing="5" font-style="italic">levé par l'arpenteur comtal — an 1330 A.E.</text>
  </g>

  <!-- Liseré du parchemin -->
  <rect x="14" y="14" width="${WIDTH - 28}" height="${HEIGHT - 28}" fill="none" stroke="#5a4130" stroke-width="2" opacity="0.5"/>
  <rect x="26" y="26" width="${WIDTH - 52}" height="${HEIGHT - 52}" fill="none" stroke="#5a1520" stroke-width="1" opacity="0.45"/>
</svg>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg, "utf8");
console.log(`Carte écrite : ${OUT} (${(svg.length / 1024).toFixed(1)} Ko)`);
