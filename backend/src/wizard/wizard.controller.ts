import { Body, Controller, Post } from '@nestjs/common';
import { WizardService, RecommendationResult } from './wizard.service';
import { RecommendInputDto } from './dto/recommend-input.dto';

/** Endpoint du tunnel « Trouver mon pneu ». */
@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  /** `POST /api/wizard/recommend` — renvoie le pneu recommandé pour le profil saisi. */
  @Post('recommend')
  recommend(@Body() input: RecommendInputDto): Promise<RecommendationResult> {
    return this.wizardService.recommend(input);
  }
}
