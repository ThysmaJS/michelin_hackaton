import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Paramètres de comparaison : les slugs des deux pneus à confronter. */
export class QueryComparatorDto {
  /** Slug du pneu de gauche (souvent le pneu recommandé). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  left!: string;

  /** Slug du pneu de droite. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  right!: string;
}
