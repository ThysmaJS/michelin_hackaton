import { Injectable } from '@nestjs/common';
import { TyresService } from '../tyres/tyres.service';
import { TyreDetail } from '../tyres/dto/tyre-response';
import { RecommendInputDto } from './dto/recommend-input.dto';
import {
  recommend,
  calcPressure,
  PressureAdvice,
} from './domain/recommendation';

/** Valeurs par défaut du profil cycliste (alignées sur le frontend). */
const DEFAULT_RIDER_KG = 75;
const DEFAULT_BIKE_KG = 8;
const DEFAULT_RIM_MM = 19;

/** Résultat d'une recommandation : pneu conseillé, slug retenu et pression conseillée. */
export interface RecommendationResult {
  recommendedSlug: string;
  tyre: TyreDetail;
  pressureAdvice: PressureAdvice;
}

/** Orchestration du tunnel de recommandation. */
@Injectable()
export class WizardService {
  constructor(private readonly tyresService: TyresService) {}

  /**
   * Détermine le pneu recommandé et la pression conseillée pour un profil d'usage.
   *
   * La décision (terrain × fréquence × profil) est purement déterministe ; le pneu
   * correspondant est ensuite chargé depuis le catalogue.
   *
   * @param input Choix du wizard (étapes usage + profil optionnel).
   */
  async recommend(input: RecommendInputDto): Promise<RecommendationResult> {
    const recommendedSlug = recommend({
      route: input.route,
      freq: input.freq,
      riderWeight: input.riderWeight,
      bikeWeight: input.bikeWeight,
      rimWidth: input.rimWidth,
      ftp: input.ftp ?? null,
    });
    const tyre = await this.tyresService.findBySlug(recommendedSlug);
    const pressureAdvice = this.pressure(
      input.riderWeight ?? DEFAULT_RIDER_KG,
      input.bikeWeight ?? DEFAULT_BIKE_KG,
      input.rimWidth ?? DEFAULT_RIM_MM,
    );
    return { recommendedSlug, tyre, pressureAdvice };
  }

  /**
   * Calcule la pression de gonflage conseillée (utilisable en temps réel par l'UI).
   * @param riderKg Poids du cycliste (kg).
   * @param bikeKg Poids du vélo (kg).
   * @param rimMm Largeur interne de jante (mm).
   */
  pressure(riderKg: number, bikeKg: number, rimMm: number): PressureAdvice {
    return calcPressure(riderKg, bikeKg, rimMm);
  }
}
