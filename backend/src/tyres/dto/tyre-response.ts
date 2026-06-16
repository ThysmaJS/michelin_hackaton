import { Prisma } from '@prisma/client';

/** Forme publique d'une gamme de pneu (résumé pour les listes/comparateur). */
export interface TyreSummary {
  slug: string;
  brand: string;
  name: string;
  tag: string | null;
  usage: string | null;
  terrain: string;
  segment: string | null;
  rubber: string | null;
  sizes: string | null;
  pressure: string | null;
  tubeless: boolean;
  grip: number;
  rendement: number;
  endurance: number;
  legerete: number;
  weightG: number | null;
  /** Poids formaté pour l'affichage (ex. "215 g"). */
  weight: string | null;
  watts: number | null;
  priceEur: number | null;
  /** Prix formaté pour l'affichage (ex. "54,90 €"). */
  price: string | null;
  isMichelin: boolean;
  discontinued: boolean;
  races: string[];
  proTeams: string[];
  proTips: string[];
}

/** Forme publique d'une variante/SKU (détail produit). */
export interface VariantResponse {
  cai: string;
  ean: string | null;
  designation: string | null;
  widthEtrto: string | null;
  diameterEtrto: string | null;
  weightG: number | null;
  minPressureBar: number | null;
  maxPressureBar: number | null;
  sealing: string | null;
  bead: string | null;
  tubeless: boolean;
  discontinued: boolean;
}

/** Détail complet d'une gamme (résumé + variantes). */
export interface TyreDetail extends TyreSummary {
  webRangeName: string | null;
  cycleType: string | null;
  rubberTechnologies: string[];
  reinforcementTechnologies: string[];
  variants: VariantResponse[];
}

/** Produit avec relations chargées (palmarès), tel que renvoyé par Prisma. */
type ProductWithRaces = Prisma.TyreProductGetPayload<{
  include: { races: true };
}>;
type ProductWithRelations = Prisma.TyreProductGetPayload<{
  include: { races: true; variants: true };
}>;

/** Projette un produit Prisma vers son résumé public. */
export function toTyreSummary(p: ProductWithRaces): TyreSummary {
  return {
    slug: p.slug,
    brand: p.brand,
    name: p.name,
    tag: p.tag,
    usage: p.usage,
    terrain: p.terrain,
    segment: p.segment,
    rubber: p.rubber,
    sizes: p.sizes,
    pressure: p.pressure,
    tubeless: p.tubeless,
    grip: p.grip,
    rendement: p.rendement,
    endurance: p.endurance,
    legerete: p.legerete,
    weightG: p.weightG,
    weight: p.weightG != null ? `${p.weightG} g` : null,
    watts: p.watts,
    priceEur: p.priceEur,
    price: p.priceEur != null ? `${p.priceEur.toFixed(2).replace('.', ',')} €` : null,
    isMichelin: p.isMichelin,
    discontinued: p.discontinued,
    races: p.races.map((r) => r.name),
    proTeams: p.proTeams,
    proTips: p.proTips,
  };
}

/** Projette un produit Prisma (variantes incluses) vers son détail public. */
export function toTyreDetail(p: ProductWithRelations): TyreDetail {
  return {
    ...toTyreSummary(p),
    webRangeName: p.webRangeName,
    cycleType: p.cycleType,
    rubberTechnologies: p.rubberTechnologies,
    reinforcementTechnologies: p.reinforcementTechnologies,
    variants: p.variants.map((v) => ({
      cai: v.cai,
      ean: v.ean,
      designation: v.designation,
      widthEtrto: v.widthEtrto,
      diameterEtrto: v.diameterEtrto,
      weightG: v.weightG,
      minPressureBar: v.minPressureBar,
      maxPressureBar: v.maxPressureBar,
      sealing: v.sealing,
      bead: v.bead,
      tubeless: (v.sealing ?? '').toUpperCase().includes('TUBELESS'),
      discontinued:
        v.discontinuedAt !== null && v.discontinuedAt.getTime() < Date.now(),
    })),
  };
}
