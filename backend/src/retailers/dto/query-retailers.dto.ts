import { IsOptional, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Paramètres de recherche de revendeurs. */
export class QueryRetailersDto {
  /** Code postal ou ville saisis par l'utilisateur. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  postal!: string;

  /** Slug du pneu recherché (contexte ; non filtrant pour l'instant). */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  tyre?: string;
}
