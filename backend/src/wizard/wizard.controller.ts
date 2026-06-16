import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WizardService, RecommendationResult } from './wizard.service';
import { RecommendInputDto } from './dto/recommend-input.dto';
import { QueryPressureDto } from './dto/query-pressure.dto';
import type { PressureAdvice } from './domain/recommendation';

/** Endpoints du tunnel « Trouver mon pneu ». */
@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  /** `POST /api/wizard/recommend` — pneu recommandé + pression conseillée. */
  @Post('recommend')
  recommend(@Body() input: RecommendInputDto): Promise<RecommendationResult> {
    return this.wizardService.recommend(input);
  }

  /** `GET /api/wizard/pressure?riderKg=&bikeKg=&rimMm=` — calcul de pression en temps réel. */
  @Get('pressure')
  pressure(@Query() query: QueryPressureDto): PressureAdvice {
    return this.wizardService.pressure(
      query.riderKg,
      query.bikeKg,
      query.rimMm,
    );
  }
}
