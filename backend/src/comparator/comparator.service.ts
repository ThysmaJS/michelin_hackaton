import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TyreSummary, toTyreSummary } from '../tyres/dto/tyre-response';

/** Définition d'une métrique du radar comparatif. */
export interface MetricResponse {
  label: string;
  key: string;
}

/** Résultat d'une comparaison côte à côte. */
export interface ComparisonResult {
  left: TyreSummary;
  right: TyreSummary;
  metrics: MetricResponse[];
}

/** Comparaison de deux pneus sur leurs caractéristiques clés. */
@Injectable()
export class ComparatorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Compare deux gammes par leurs slugs.
   * @throws NotFoundException si l'un des slugs est inconnu.
   */
  async compare(
    leftSlug: string,
    rightSlug: string,
  ): Promise<ComparisonResult> {
    const [products, metrics] = await Promise.all([
      this.prisma.tyreProduct.findMany({
        where: { slug: { in: [leftSlug, rightSlug] } },
        include: { races: true },
      }),
      this.prisma.metric.findMany({
        orderBy: { order: 'asc' },
        select: { label: true, key: true },
      }),
    ]);

    const left = products.find((p) => p.slug === leftSlug);
    const right = products.find((p) => p.slug === rightSlug);
    if (!left) throw new NotFoundException(`Pneu introuvable : ${leftSlug}`);
    if (!right) throw new NotFoundException(`Pneu introuvable : ${rightSlug}`);

    return { left: toTyreSummary(left), right: toTyreSummary(right), metrics };
  }
}
