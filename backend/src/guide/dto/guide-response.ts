import { Prisma } from '@prisma/client';
import { TyreSummary, toTyreSummary } from '../../tyres/dto/tyre-response';

/** Résumé d'un parcours (cartes de la section Guide). */
export interface RouteSummary {
  title: string;
  terrain: string;
  loc: string;
  distance: string;
  surface: string;
  stars: string;
  blurb: string;
  recommendedTyreSlug: string | null;
}

/** Segment d'un parcours (étape du tracé). */
export interface SegmentResponse {
  order: number;
  name: string;
  km: string;
  type: string;
  description: string;
}

/** Point GPS du tracé. */
export interface WaypointResponse {
  order: number;
  lat: number;
  lng: number;
}

/** Record (KOM) du segment. */
export interface KomResponse {
  time: string;
  holder: string;
  tyre: string;
  year: number;
  context: string;
}

/** Détail éditorial complet d'un parcours. */
export interface RouteDetail extends RouteSummary {
  region: { key: string; label: string };
  elevation: string | null;
  difficulty: string | null;
  season: string | null;
  tyreReason: string | null;
  kom: KomResponse | null;
  recommendedTyre: TyreSummary | null;
  segments: SegmentResponse[];
  waypoints: WaypointResponse[];
}

type RouteWithTyre = Prisma.RouteGetPayload<{
  include: { recommendedTyre: { include: { races: true } } };
}>;
type RouteFull = Prisma.RouteGetPayload<{
  include: {
    region: true;
    recommendedTyre: { include: { races: true } };
    segments: true;
    waypoints: true;
  };
}>;

/** Projette un parcours Prisma vers son résumé public. */
export function toRouteSummary(r: RouteWithTyre): RouteSummary {
  return {
    title: r.title,
    terrain: r.terrain,
    loc: r.loc,
    distance: r.distance,
    surface: r.surface,
    stars: r.stars,
    blurb: r.blurb,
    recommendedTyreSlug: r.recommendedTyre?.slug ?? null,
  };
}

/** Projette un parcours Prisma (relations incluses) vers son détail public. */
export function toRouteDetail(r: RouteFull): RouteDetail {
  return {
    ...toRouteSummary(r),
    region: { key: r.region.key, label: r.region.label },
    elevation: r.elevation,
    difficulty: r.difficulty,
    season: r.season,
    tyreReason: r.tyreReason,
    kom:
      r.komHolder && r.komTime
        ? {
            time: r.komTime,
            holder: r.komHolder,
            tyre: r.komTyre ?? '',
            year: r.komYear ?? 0,
            context: r.komContext ?? '',
          }
        : null,
    recommendedTyre: r.recommendedTyre
      ? toTyreSummary(r.recommendedTyre)
      : null,
    segments: [...r.segments]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        order: s.order,
        name: s.name,
        km: s.km,
        type: s.type,
        description: s.description,
      })),
    waypoints: [...r.waypoints]
      .sort((a, b) => a.order - b.order)
      .map((w) => ({ order: w.order, lat: w.lat, lng: w.lng })),
  };
}
