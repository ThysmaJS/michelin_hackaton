import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TyreSummary, toTyreSummary } from '../tyres/dto/tyre-response';

/**
 * Agrégat servi au frontend en un seul appel, dans les formes exactes des anciens
 * fichiers `data.js` / `guideData.js`. Permet de câbler la SPA sans changer la forme
 * des données consommées par les composants.
 */
export interface BootstrapData {
  tyres: Record<string, TyreSummary>;
  competitors: Record<string, TyreSummary>;
  brands: string[];
  modelsByBrand: Record<string, [string, string][]>;
  genericModels: [string, string][];
  metricDefs: [string, string][];
  regions: { key: string; label: string }[];
  regionRoutes: Record<string, FrontRoute[]>;
  routeDetails: Record<string, FrontRouteDetail>;
  retailerData: FrontRetailer[];
  footerCols: { title: string; links: string[] }[];
  socials: string[];
  legalLinks: string[];
  heroStats: { num: string; label: string }[];
  stepMeta: { block: string; title: string; hint: string }[];
  freqList: [string, string, string][];
  routeList: [string, string, string][];
  currentTyreList: [string, string][];
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
  elevation: string | null;
  difficulty: string | null;
  season: string | null;
  tyreKey: string | null;
  tyreReason: string | null;
  waypoints: [number, number][];
  segments: { name: string; km: string; type: string; desc: string }[];
  kom?: { time: string; holder: string; tyre: string; year: number; context: string };
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

@Injectable()
export class BootstrapService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Charge l'intégralité des données de contenu de la landing page.
   * @returns Toutes les collections dans les formes attendues par le frontend.
   */
  async getBootstrap(): Promise<BootstrapData> {
    const [products, brands, generic, metrics, regions, routes, retailers, footerColumns, siteLinks, heroStats, steps, freqs, routeTypes, currentTyres] =
      await Promise.all([
        this.prisma.tyreProduct.findMany({ include: { races: true }, orderBy: { name: 'asc' } }),
        this.prisma.bikeBrand.findMany({ orderBy: { name: 'asc' }, include: { models: { orderBy: { name: 'asc' } } } }),
        this.prisma.bikeModel.findMany({ where: { isGeneric: true }, orderBy: { name: 'asc' } }),
        this.prisma.metric.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.region.findMany({ orderBy: { label: 'asc' } }),
        this.prisma.route.findMany({
          include: { region: true, recommendedTyre: true, segments: true, waypoints: true },
        }),
        this.prisma.retailer.findMany(),
        this.prisma.footerColumn.findMany({ orderBy: { order: 'asc' }, include: { links: { orderBy: { order: 'asc' } } } }),
        this.prisma.siteLink.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.heroStat.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.wizardStep.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.frequency.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.routeType.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.currentTyreOption.findMany({ orderBy: { order: 'asc' } }),
      ]);

    // Catalogue : séparé Michelin / concurrents, indexé par slug.
    const tyres: Record<string, TyreSummary> = {};
    const competitors: Record<string, TyreSummary> = {};
    for (const p of products) {
      const summary = toTyreSummary(p);
      (p.isMichelin ? tyres : competitors)[p.slug] = summary;
    }

    // Vélos.
    const modelsByBrand: Record<string, [string, string][]> = {};
    for (const b of brands) {
      if (b.models.length) {
        modelsByBrand[b.name] = b.models.map((m) => [m.name, m.type] as [string, string]);
      }
    }

    // Guide : parcours groupés par région + détails indexés par titre.
    const regionRoutes: Record<string, FrontRoute[]> = {};
    const routeDetails: Record<string, FrontRouteDetail> = {};
    for (const r of routes) {
      (regionRoutes[r.region.key] ??= []).push({
        t: r.terrain,
        title: r.title,
        loc: r.loc,
        distance: r.distance,
        surface: r.surface,
        stars: r.stars,
        blurb: r.blurb,
      });
      routeDetails[r.title] = {
        elevation: r.elevation,
        difficulty: r.difficulty,
        season: r.season,
        tyreKey: r.recommendedTyre?.slug ?? null,
        tyreReason: r.tyreReason,
        waypoints: [...r.waypoints].sort((a, b) => a.order - b.order).map((w) => [w.lat, w.lng] as [number, number]),
        segments: [...r.segments]
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ name: s.name, km: s.km, type: s.type, desc: s.description })),
        ...(r.komHolder && r.komTime
          ? {
              kom: {
                time: r.komTime,
                holder: r.komHolder,
                tyre: r.komTyre ?? '',
                year: r.komYear ?? 0,
                context: r.komContext ?? '',
              },
            }
          : {}),
      };
    }

    return {
      tyres,
      competitors,
      brands: brands.map((b) => b.name),
      modelsByBrand,
      genericModels: generic.map((m) => [m.name, m.type] as [string, string]),
      metricDefs: metrics.map((m) => [m.label, m.key] as [string, string]),
      regions: regions.map((r) => ({ key: r.key, label: r.label })),
      regionRoutes,
      routeDetails,
      retailerData: retailers.map((r) => ({
        name: r.name,
        address: r.address,
        city: r.city,
        distance: r.distance,
        stock: r.stock,
        lat: r.lat,
        lng: r.lng,
      })),
      footerCols: footerColumns.map((c) => ({ title: c.title, links: c.links.map((l) => l.label) })),
      socials: siteLinks.filter((l) => l.type === 'social').map((l) => l.label),
      legalLinks: siteLinks.filter((l) => l.type === 'legal').map((l) => l.label),
      heroStats: heroStats.map((h) => ({ num: h.num, label: h.label })),
      stepMeta: steps.map((s) => ({ block: s.block, title: s.title, hint: s.hint })),
      freqList: freqs.map((f) => [f.label, f.description, f.icon] as [string, string, string]),
      routeList: routeTypes.map((r) => [r.label, r.description, r.icon] as [string, string, string]),
      currentTyreList: currentTyres.map((c) => [c.label, c.note] as [string, string]),
    };
  }
}
