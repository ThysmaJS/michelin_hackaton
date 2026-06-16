/**
 * Seed de la base Michelin Vélo.
 *
 * Deux sources, fusionnées :
 *   1. Catalogue produit réel (Excel « ACTIVE PRODUCTS ») → gammes Michelin +
 *      variantes/SKU. Les scores radar sont calculés via deriveScores() à partir
 *      des attributs réels (usage, gomme, poids, segment, renfort).
 *   2. Données du frontend (data.js / guideData.js, chargées dynamiquement) →
 *      concurrents, vélos, régions/parcours du Guide, revendeurs, et toutes les
 *      tables de référence de l'UI.
 *
 * Le seed est idempotent : il purge les tables puis réinsère tout.
 */
import { PrismaClient, Terrain } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { deriveScores } from '../src/tyres/domain/scoring';

const prisma = new PrismaClient();

// Import ESM depuis un contexte CommonJS (ts-node) sans que TypeScript ne réécrive
// le `import()` dynamique en `require()`.
const importEsm = new Function('s', 'return import(s)') as (s: string) => Promise<Record<string, unknown>>;

const FRONTEND_LIB = path.resolve(__dirname, '../../frontend/src/lib');
const EXCEL_PATH = path.resolve(__dirname, '../data/2W Bicycle Product Catalog v4 - 2026.xlsx');

// ─── Helpers de normalisation ────────────────────────────────────────────────

/** Transforme un libellé en slug stable (« POWER GRAVEL RS » → « power-gravel-rs »). */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // supprime les diacritiques
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Chaîne nettoyée, ou null si vide. */
function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

/** Entier, ou null si non parsable. */
function int(v: unknown): number | null {
  const n = parseInt(String(v ?? '').replace(',', '.'), 10);
  return Number.isFinite(n) ? n : null;
}

/** Flottant, ou null (gère « - » et les décimales à virgule). */
function float(v: unknown): number | null {
  if (v === null || v === undefined || v === '-' || v === '') return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Prix « 54,90 € » → 54.9. */
function price(v: unknown): number | null {
  if (!v) return null;
  const n = parseFloat(String(v).replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Découpe une cellule multi-valeurs (« A,B, C ») en tokens uniques nettoyés. */
function tokens(v: unknown): string[] {
  return [...new Set(String(v ?? '').split(',').map((t) => t.trim()).filter(Boolean))];
}

/** Met en forme un titre (« POWER CUP » → « Power Cup »). */
function titleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b([a-z0-9])/g, (m) => m.toUpperCase());
}

/** Numéro de série Excel → Date (epoch Excel = 1899-12-30). */
function excelDate(serial: unknown): Date | null {
  const n = typeof serial === 'number' ? serial : Number(serial);
  if (!Number.isFinite(n) || n <= 0) return null;
  return new Date(Date.UTC(1899, 11, 30) + n * 86_400_000);
}

/** Format français d'un nombre de bar (5 → « 5 », 3.5 → « 3,5 »). */
function bar(n: number): string {
  return String(n).replace('.', ',');
}

// ─── Type d'une ligne Excel (colonnes utiles) ────────────────────────────────

type Row = Record<string, unknown>;

/** Dérive le terrain normalisé d'une gamme à partir du cycle et des mots-clés. */
function deriveTerrain(cycleType: string, rangeName: string, uses: string[]): Terrain {
  const up = cycleType.toUpperCase();
  if (up === 'CITY') return Terrain.city;
  if (up === 'MTB') return Terrain.mtb;
  // ROAD : gravel si la gamme/usage évoque le tout-terrain léger, sinon route.
  const haystack = `${rangeName} ${uses.join(' ')}`.toUpperCase();
  if (/GRAVEL|ADVENTURE|CYCLOCROSS/.test(haystack)) return Terrain.gravel;
  return Terrain.route;
}

// ─── Purge (ordre enfant → parent) ───────────────────────────────────────────

async function purge(): Promise<void> {
  await prisma.$transaction([
    prisma.routeSegment.deleteMany(),
    prisma.routeWaypoint.deleteMany(),
    prisma.route.deleteMany(),
    prisma.region.deleteMany(),
    prisma.tyreVariant.deleteMany(),
    prisma.tyreRace.deleteMany(),
    prisma.tyreProduct.deleteMany(),
    prisma.bikeModel.deleteMany(),
    prisma.bikeBrand.deleteMany(),
    prisma.retailer.deleteMany(),
    prisma.postalDepartment.deleteMany(),
    prisma.frequency.deleteMany(),
    prisma.routeType.deleteMany(),
    prisma.currentTyreOption.deleteMany(),
    prisma.metric.deleteMany(),
    prisma.wizardStep.deleteMany(),
    prisma.heroStat.deleteMany(),
    prisma.footerLink.deleteMany(),
    prisma.footerColumn.deleteMany(),
    prisma.siteLink.deleteMany(),
  ]);
}

// ─── 1. Catalogue Michelin (Excel) ───────────────────────────────────────────

/**
 * Importe les gammes et variantes Michelin depuis l'Excel.
 * @param meta Métadonnées frontend par slug (prix, watts, tag, usage, palmarès).
 */
async function seedMichelinCatalog(meta: Record<string, MichelinMeta>): Promise<void> {
  const wb = XLSX.readFile(EXCEL_PATH);
  const rows = XLSX.utils.sheet_to_json<Row>(wb.Sheets['ACTIVE PRODUCTS'], { defval: null });

  // On ne garde que les pneus (hors chambres à air « TUBE »).
  const tyreRows = rows.filter((r) => String(r['Product Type']).toUpperCase() !== 'TUBE');

  // Regroupement par gamme (Range Internal).
  const groups = new Map<string, Row[]>();
  for (const r of tyreRows) {
    const range = str(r['Range (Internal)']);
    if (!range) continue;
    const bucket = groups.get(range);
    if (bucket) bucket.push(r);
    else groups.set(range, [r]);
  }

  const usedSlugs = new Set<string>();
  let productCount = 0;
  let variantCount = 0;

  for (const [range, group] of groups) {
    // Slug unique (garde-fou anti-collision).
    let slug = slugify(range);
    while (usedSlugs.has(slug)) slug = `${slug}-x`;
    usedSlugs.add(slug);

    const first = group[0];
    const cycleType = str(first['Cycle Type']) ?? 'ROAD';
    const segment = str(first['Segment']);
    const productType = str(first['Product Type']);

    // Agrégats sur les variantes.
    const usesSet = new Set<string>();
    const terrainSet = new Set<string>();
    const rubberSet = new Set<string>();
    const casingSet = new Set<string>();
    const treadSet = new Set<string>();
    const reinfSet = new Set<string>();
    const ebikeSet = new Set<string>();
    const widths: number[] = [];
    const weights: number[] = [];
    const minBars: number[] = [];
    const maxBars: number[] = [];
    let tubeless = false;
    let reinforced = false;
    let allDiscontinued = true;

    for (const r of group) {
      tokens(r['Use']).forEach((t) => usesSet.add(t));
      tokens(r['Terrain Types']).forEach((t) => terrainSet.add(t));
      tokens(r['Rubber Technologies']).forEach((t) => rubberSet.add(t));
      tokens(r['Casing Technologies']).forEach((t) => casingSet.add(t));
      tokens(r['Tread Pattern Technologies']).forEach((t) => treadSet.add(t));
      tokens(r['Reinforcement Technologies']).forEach((t) => reinfSet.add(t));
      tokens(r['E-Bike Technologies']).forEach((t) => ebikeSet.add(t));

      if (String(r['Sealing']).toUpperCase().includes('TUBELESS')) tubeless = true;
      if (tokens(r['Reinforcement Technologies']).length) reinforced = true;

      const w = int(r['Weight (g)']);
      if (w && w > 0) weights.push(w);
      const ww = int(r['Web Width (mm)']) ?? int(r['Width ETRTO']);
      if (ww && ww > 0) widths.push(ww);
      const pmin = float(r['Minimum Pressure (Bar)']);
      const pmax = float(r['Maximum Pressure (Bar)']);
      if (pmin !== null) minBars.push(pmin);
      if (pmax !== null) maxBars.push(pmax);

      const disc = excelDate(r['Discontinued Date']);
      if (!disc || disc.getTime() > Date.now()) allDiscontinued = false;
    }

    const uses = [...usesSet];
    const terrain = deriveTerrain(cycleType, range, uses);
    const rubber = [...rubberSet][0] ?? null;
    const weightG = weights.length ? Math.min(...weights) : null;
    const m = meta[slug];

    // Gammes vitrines (présentes dans le frontend) : scores curatés et statut actif.
    // Reste du catalogue : scores calculés depuis les attributs réels + statut EOL réel.
    const isShowcase = m !== undefined;
    const scores = isShowcase
      ? { grip: m.grip, rendement: m.rendement, endurance: m.endurance, legerete: m.legerete }
      : deriveScores({ uses, terrain, rubber, weight: weightG ?? 300, segment, reinforced, name: range });

    // Résumés dimensions / pression pour le comparateur.
    const sizes =
      widths.length === 0
        ? null
        : Math.min(...widths) === Math.max(...widths)
          ? `700×${Math.min(...widths)}C`
          : `700×${Math.min(...widths)} à ${Math.max(...widths)}C`;
    const pressure =
      minBars.length && maxBars.length
        ? `${bar(Math.min(...minBars))} – ${bar(Math.max(...maxBars))} bar`
        : null;

    const product = await prisma.tyreProduct.create({
      data: {
        slug,
        brand: 'MICHELIN',
        name: m?.name ?? titleCase(range),
        webRangeName: str(first['Web Range Name']),
        rangeInternal: range,
        tag: m?.tag ?? null,
        usage: m?.usage ?? null,
        productType,
        cycleType,
        segment,
        terrain,
        uses,
        terrainTypes: [...terrainSet],
        rubber,
        rubberTechnologies: [...rubberSet],
        casingTechnologies: [...casingSet],
        treadTechnologies: [...treadSet],
        reinforcementTechnologies: [...reinfSet],
        eBikeTechnologies: [...ebikeSet],
        tubeless,
        reinforced,
        grip: scores.grip,
        rendement: scores.rendement,
        endurance: scores.endurance,
        legerete: scores.legerete,
        weightG,
        watts: m?.watts ?? null,
        priceEur: m?.priceEur ?? null,
        sizes,
        pressure,
        isMichelin: true,
        discontinued: isShowcase ? false : allDiscontinued,
        races: m?.races?.length
          ? { create: m.races.map((name) => ({ name })) }
          : undefined,
      },
    });
    productCount += 1;

    // Variantes / SKU.
    for (const r of group) {
      const cai = str(r['CAI (Manufacturer Code)']);
      if (!cai) continue;
      await prisma.tyreVariant.create({
        data: {
          productId: product.id,
          globalId: str(r['Global ID']),
          cai,
          ean: str(r['EAN Code']),
          mspn: str(r['MSPN Code (Internal)']),
          upc: str(r['UPC Code']),
          designation: str(r['Designation (Internal)']),
          webDesignation: str(r['Web Product Designation']),
          widthEtrto: str(r['Width ETRTO']),
          diameterEtrto: str(r['Diameter ETRTO']),
          webWidthMm: str(r['Web Width (mm)']),
          webDiameterMm: str(r['Web Diameter (mm)']),
          weightG: int(r['Weight (g)']),
          minPressureBar: float(r['Minimum Pressure (Bar)']),
          maxPressureBar: float(r['Maximum Pressure (Bar)']),
          minPressurePsi: int(r['Minimum Pressure (Psi)']),
          maxPressurePsi: int(r['Maximum Pressure (Psi)']),
          bead: str(r['Bead']),
          sealing: str(r['Sealing']),
          rimType: str(r['Rim Type']),
          tpi: str(r['TPI']),
          fitting: str(r['Fitting']),
          sidewallColor: str(r['Sidewall Color']),
          treadPatternColor: str(r['Tread Pattern Color']),
          shoulderColor: str(r['Shoulder Color']),
          borderColor: str(r['Border Color']),
          labelType: str(r['Label type']),
          marketPerimeter: str(r['Market Perimeter']),
          discontinuedAt: excelDate(r['Discontinued Date']),
        },
      });
      variantCount += 1;
    }
  }

  console.log(`  ✓ ${productCount} gammes Michelin, ${variantCount} variantes`);
}

// ─── 2. Concurrents (frontend) ───────────────────────────────────────────────

async function seedCompetitors(competitors: Record<string, FrontTyre>): Promise<void> {
  for (const [slug, t] of Object.entries(competitors)) {
    await prisma.tyreProduct.create({
      data: {
        slug,
        brand: t.brand,
        name: t.name,
        usage: t.usage,
        segment: t.segment,
        terrain: t.terrain === 'gravel' ? Terrain.gravel : Terrain.route,
        rubber: t.rubber,
        tubeless: !!t.tubeless,
        grip: t.grip,
        rendement: t.rendement,
        endurance: t.endurance,
        legerete: t.legerete,
        weightG: t.weightG,
        watts: t.watts,
        priceEur: price(t.price),
        sizes: t.sizes,
        pressure: t.pressure,
        isMichelin: false,
      },
    });
  }
  console.log(`  ✓ ${Object.keys(competitors).length} pneus concurrents`);
}

// ─── 3. Vélos (frontend) ─────────────────────────────────────────────────────

async function seedBikes(
  brands: string[],
  modelsByBrand: Record<string, [string, string][]>,
  genericModels: [string, string][],
): Promise<void> {
  for (const name of brands) {
    const brand = await prisma.bikeBrand.create({ data: { name, slug: slugify(name) } });
    for (const [model, type] of modelsByBrand[name] ?? []) {
      await prisma.bikeModel.create({ data: { brandId: brand.id, name: model, type } });
    }
  }
  for (const [name, type] of genericModels) {
    await prisma.bikeModel.create({ data: { name, type, isGeneric: true } });
  }
  console.log(`  ✓ ${brands.length} marques de vélo + modèles génériques`);
}

// ─── 4. Guide (régions / parcours) ───────────────────────────────────────────

async function seedGuide(
  regions: { key: string; label: string }[],
  regionRoutes: Record<string, FrontRoute[]>,
  routeDetails: Record<string, FrontRouteDetail>,
  slugToId: Map<string, string>,
): Promise<void> {
  let routeCount = 0;
  for (const region of regions) {
    const created = await prisma.region.create({ data: { key: region.key, label: region.label } });
    for (const r of regionRoutes[region.key] ?? []) {
      const detail = routeDetails[r.title];
      const recommendedTyreId = detail ? slugToId.get(detail.tyreKey) ?? null : null;
      await prisma.route.create({
        data: {
          title: r.title,
          regionId: created.id,
          terrain: r.t === 'gravel' ? Terrain.gravel : Terrain.route,
          loc: r.loc,
          distance: r.distance,
          surface: r.surface,
          stars: r.stars,
          blurb: r.blurb,
          elevation: detail?.elevation ?? null,
          difficulty: detail?.difficulty ?? null,
          season: detail?.season ?? null,
          tyreReason: detail?.tyreReason ?? null,
          recommendedTyreId,
          segments: detail
            ? { create: detail.segments.map((s, i) => ({ order: i, name: s.name, km: s.km, type: s.type, description: s.desc })) }
            : undefined,
          waypoints: detail
            ? { create: detail.waypoints.map(([lat, lng], i) => ({ order: i, lat, lng })) }
            : undefined,
        },
      });
      routeCount += 1;
    }
  }
  console.log(`  ✓ ${regions.length} régions, ${routeCount} parcours`);
}

// ─── 5. Revendeurs + mapping postal ──────────────────────────────────────────

async function seedRetailers(retailers: FrontRetailer[]): Promise<void> {
  // Les revendeurs du jeu de données frontend sont tous en région lyonnaise (aura).
  await prisma.retailer.createMany({
    data: retailers.map((r) => ({
      name: r.name,
      address: r.address,
      city: r.city,
      distance: r.distance,
      stock: r.stock,
      lat: r.lat,
      lng: r.lng,
      regionKey: 'aura',
    })),
  });
  console.log(`  ✓ ${retailers.length} revendeurs`);
}

// Mapping département → région (depuis recommend.js, non exporté donc recopié ici).
const DEPARTMENT_MAP: Record<string, string[]> = {
  aura: ['69', '01', '03', '07', '15', '26', '38', '42', '43', '63', '73', '74'],
  paca: ['04', '05', '06', '13', '83', '84'],
  idf: ['75', '77', '78', '91', '92', '93', '94', '95'],
  bretagne: ['22', '29', '35', '56'],
  occitanie: ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'],
  aquitaine: ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'],
};

async function seedPostalDepartments(): Promise<void> {
  const data = Object.entries(DEPARTMENT_MAP).flatMap(([regionKey, codes]) =>
    codes.map((code) => ({ code, regionKey })),
  );
  await prisma.postalDepartment.createMany({ data });
  console.log(`  ✓ ${data.length} départements mappés`);
}

// ─── 6. Tables de référence de l'UI ──────────────────────────────────────────

async function seedReference(fd: FrontendData): Promise<void> {
  await prisma.frequency.createMany({
    data: fd.freqList.map(([label, description, icon], order) => ({ code: label, label, description, icon, order })),
  });
  await prisma.routeType.createMany({
    data: fd.routeList.map(([label, description, icon], order) => ({ code: label, label, description, icon, order })),
  });
  await prisma.currentTyreOption.createMany({
    data: fd.currentTyreList.map(([label, note], order) => ({ label, note, order })),
  });
  await prisma.metric.createMany({
    data: fd.metricDefs.map(([label, key], order) => ({ label, key, order })),
  });
  await prisma.wizardStep.createMany({
    data: fd.stepMeta.map((s, order) => ({ block: s.block, title: s.title, hint: s.hint, order })),
  });
  await prisma.heroStat.createMany({
    data: fd.heroStats.map((s, order) => ({ num: s.num, label: s.label, order })),
  });
  for (const [order, col] of fd.footerCols.entries()) {
    await prisma.footerColumn.create({
      data: { title: col.title, order, links: { create: col.links.map((label, i) => ({ label, order: i })) } },
    });
  }
  await prisma.siteLink.createMany({
    data: [
      ...fd.socials.map((label, order) => ({ type: 'social', label, order })),
      ...fd.legalLinks.map((label, order) => ({ type: 'legal', label, order })),
    ],
  });
  console.log('  ✓ tables de référence (UI) chargées');
}

// ─── Types des données frontend ──────────────────────────────────────────────

interface MichelinMeta {
  name: string;
  tag: string;
  usage: string;
  watts: number;
  priceEur: number;
  races: string[];
  // Scores curatés par le frontend pour les gammes vitrines (priment sur deriveScores).
  grip: number;
  rendement: number;
  endurance: number;
  legerete: number;
}
interface FrontTyre {
  brand: string;
  name: string;
  usage: string;
  grip: number;
  rendement: number;
  endurance: number;
  legerete: number;
  weightG: number;
  watts: number;
  price: string;
  terrain: string;
  segment: string;
  rubber: string;
  sizes: string;
  pressure: string;
  tubeless?: boolean;
  tag?: string;
  races?: string[];
}
interface FrontRoute {
  t: string;
  title: string;
  loc: string;
  distance: string;
  surface: string;
  stars: string;
  blurb: string;
}
interface FrontRouteDetail {
  elevation: string;
  difficulty: string;
  season: string;
  tyreKey: string;
  tyreReason: string;
  waypoints: [number, number][];
  segments: { name: string; km: string; type: string; desc: string }[];
}
interface FrontRetailer {
  name: string;
  address: string;
  city: string;
  distance: string;
  stock: boolean;
  lat: number;
  lng: number;
}
interface FrontendData {
  freqList: [string, string, string][];
  routeList: [string, string, string][];
  currentTyreList: [string, string][];
  metricDefs: [string, string][];
  stepMeta: { block: string; title: string; hint: string }[];
  heroStats: { num: string; label: string }[];
  footerCols: { title: string; links: string[] }[];
  socials: string[];
  legalLinks: string[];
}

/** Construit la table de métadonnées Michelin (par slug) depuis le `tyres` frontend. */
function buildMichelinMeta(tyres: Record<string, FrontTyre>): Record<string, MichelinMeta> {
  const meta: Record<string, MichelinMeta> = {};
  for (const [slug, t] of Object.entries(tyres)) {
    meta[slug] = {
      name: t.name,
      tag: t.tag ?? '',
      usage: t.usage,
      watts: t.watts,
      priceEur: price(t.price) ?? 0,
      races: t.races ?? [],
      grip: t.grip,
      rendement: t.rendement,
      endurance: t.endurance,
      legerete: t.legerete,
    };
  }
  return meta;
}

// ─── Orchestration ───────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('🌱 Seed Michelin Vélo');

  // Chargement des données pures du frontend.
  const data = await importEsm(pathToFileURL(path.join(FRONTEND_LIB, 'data.js')).href);
  const guide = await importEsm(pathToFileURL(path.join(FRONTEND_LIB, 'guideData.js')).href);

  const tyres = data.tyres as Record<string, FrontTyre>;
  const competitors = data.competitors as Record<string, FrontTyre>;

  await purge();

  console.log('• Catalogue');
  await seedMichelinCatalog(buildMichelinMeta(tyres));
  await seedCompetitors(competitors);

  // Index slug → id (pour lier les pneus conseillés des parcours).
  const products = await prisma.tyreProduct.findMany({ select: { id: true, slug: true } });
  const slugToId = new Map(products.map((p) => [p.slug, p.id]));

  console.log('• Vélos');
  await seedBikes(
    data.brands as string[],
    data.modelsByBrand as Record<string, [string, string][]>,
    data.genericModels as [string, string][],
  );

  console.log('• Guide');
  await seedGuide(
    data.regions as { key: string; label: string }[],
    data.regionRoutes as Record<string, FrontRoute[]>,
    guide.routeDetails as Record<string, FrontRouteDetail>,
    slugToId,
  );

  console.log('• Revendeurs & postal');
  await seedRetailers(data.retailerData as FrontRetailer[]);
  await seedPostalDepartments();

  console.log('• Référence UI');
  await seedReference({
    freqList: data.freqList as [string, string, string][],
    routeList: data.routeList as [string, string, string][],
    currentTyreList: data.currentTyreList as [string, string][],
    metricDefs: data.metricDefs as [string, string][],
    stepMeta: data.stepMeta as { block: string; title: string; hint: string }[],
    heroStats: data.heroStats as { num: string; label: string }[],
    footerCols: data.footerCols as { title: string; links: string[] }[],
    socials: data.socials as string[],
    legalLinks: data.legalLinks as string[],
  });

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => {
    console.error('❌ Échec du seed :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
