import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Filtre des parcours par pneu recommandé. */
export class QueryRoutesByTyreDto {
  /** Slug du pneu dont on veut les parcours associés. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  tyre!: string;
}
