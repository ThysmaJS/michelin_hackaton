import { Injectable } from '@nestjs/common';
import { TyresService } from '../tyres/tyres.service';
import { TyreDetail } from '../tyres/dto/tyre-response';
import { RecommendInputDto } from './dto/recommend-input.dto';
import { recommend } from './domain/recommendation';

/** Résultat d'une recommandation : le pneu conseillé et le slug retenu. */
export interface RecommendationResult {
  recommendedSlug: string;
  tyre: TyreDetail;
}

/** Orchestration du tunnel de recommandation. */
@Injectable()
export class WizardService {
  constructor(private readonly tyresService: TyresService) {}

  /**
   * Détermine et renvoie le pneu Michelin recommandé pour un profil d'usage.
   *
   * La décision (terrain × fréquence) est purement déterministe ; le pneu
   * correspondant est ensuite chargé depuis le catalogue.
   *
   * @param input Choix du wizard.
   * @returns Le slug retenu et le détail du pneu recommandé.
   */
  async recommend(input: RecommendInputDto): Promise<RecommendationResult> {
    const recommendedSlug = recommend({ route: input.route, freq: input.freq });
    const tyre = await this.tyresService.findBySlug(recommendedSlug);
    return { recommendedSlug, tyre };
  }
}
