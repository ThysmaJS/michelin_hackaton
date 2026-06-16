import { Controller, Get } from '@nestjs/common';
import {
  FooterReference,
  ReferenceService,
  WizardReference,
} from './reference.service';

/** Endpoints de contenu de référence de l'UI (wizard, métriques, hero, footer). */
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  /** `GET /api/reference/wizard` — étapes et options du tunnel. */
  @Get('wizard')
  getWizard(): Promise<WizardReference> {
    return this.referenceService.getWizardReference();
  }

  /** `GET /api/reference/metrics` — métriques du comparateur. */
  @Get('metrics')
  getMetrics(): Promise<{ label: string; key: string }[]> {
    return this.referenceService.getMetrics();
  }

  /** `GET /api/reference/hero` — statistiques du Hero. */
  @Get('hero')
  getHero(): Promise<{ num: string; label: string }[]> {
    return this.referenceService.getHeroStats();
  }

  /** `GET /api/reference/footer` — contenu du pied de page. */
  @Get('footer')
  getFooter(): Promise<FooterReference> {
    return this.referenceService.getFooter();
  }
}
