import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Données du tunnel « Trouver mon pneu » envoyées pour obtenir une recommandation. */
export class RecommendInputDto {
  /** Type de routes (libellé `RouteType.code`, ex. « Route lisse »). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  route!: string;

  /** Fréquence de sortie (libellé `Frequency.code`, ex. « Intensif »). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  freq!: string;

  /** Marque du vélo (contexte, non utilisé par le moteur de décision). */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  marque?: string;

  /** Modèle du vélo (contexte). */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  modele?: string;

  /** Pneus actuellement montés (contexte). */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  currentTyre?: string;

  /** Kilométrage mensuel estimé (contexte). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  km?: number;
}
