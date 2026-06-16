import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Contenu de référence du tunnel de sélection. */
export interface WizardReference {
  steps: { block: string; title: string; hint: string }[];
  frequencies: {
    code: string;
    label: string;
    description: string;
    icon: string;
  }[];
  routeTypes: {
    code: string;
    label: string;
    description: string;
    icon: string;
  }[];
  currentTyres: { label: string; note: string }[];
}

/** Contenu du pied de page. */
export interface FooterReference {
  columns: { title: string; links: string[] }[];
  socials: { label: string; url: string | null }[];
  legal: string[];
}

/** Sert les contenus de référence de l'UI (déportés du frontend). */
@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  /** Données nécessaires au rendu du wizard (étapes + options). */
  async getWizardReference(): Promise<WizardReference> {
    const [steps, frequencies, routeTypes, currentTyres] = await Promise.all([
      this.prisma.wizardStep.findMany({
        orderBy: { order: 'asc' },
        select: { block: true, title: true, hint: true },
      }),
      this.prisma.frequency.findMany({
        orderBy: { order: 'asc' },
        select: { code: true, label: true, description: true, icon: true },
      }),
      this.prisma.routeType.findMany({
        orderBy: { order: 'asc' },
        select: { code: true, label: true, description: true, icon: true },
      }),
      this.prisma.currentTyreOption.findMany({
        orderBy: { order: 'asc' },
        select: { label: true, note: true },
      }),
    ]);
    return { steps, frequencies, routeTypes, currentTyres };
  }

  /** Définitions des métriques du comparateur. */
  async getMetrics(): Promise<{ label: string; key: string }[]> {
    return this.prisma.metric.findMany({
      orderBy: { order: 'asc' },
      select: { label: true, key: true },
    });
  }

  /** Statistiques mises en avant dans le Hero. */
  async getHeroStats(): Promise<{ num: string; label: string }[]> {
    return this.prisma.heroStat.findMany({
      orderBy: { order: 'asc' },
      select: { num: true, label: true },
    });
  }

  /** Contenu complet du pied de page (colonnes, réseaux, mentions légales). */
  async getFooter(): Promise<FooterReference> {
    const [columns, links] = await Promise.all([
      this.prisma.footerColumn.findMany({
        orderBy: { order: 'asc' },
        include: { links: { orderBy: { order: 'asc' } } },
      }),
      this.prisma.siteLink.findMany({ orderBy: { order: 'asc' } }),
    ]);

    return {
      columns: columns.map((c) => ({
        title: c.title,
        links: c.links.map((l) => l.label),
      })),
      socials: links
        .filter((l) => l.type === 'social')
        .map((l) => ({ label: l.label, url: l.url })),
      legal: links.filter((l) => l.type === 'legal').map((l) => l.label),
    };
  }
}
