import { Type } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

/** Paramètres du calcul de pression de gonflage. */
export class QueryPressureDto {
  /** Poids du cycliste en kg. */
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(200)
  riderKg!: number;

  /** Poids du vélo en kg. */
  @Type(() => Number)
  @IsNumber()
  @Min(3)
  @Max(30)
  bikeKg!: number;

  /** Largeur interne de jante en mm. */
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(40)
  rimMm!: number;
}
