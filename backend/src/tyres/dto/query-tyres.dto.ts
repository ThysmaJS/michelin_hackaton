import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/** Terrains acceptés en filtre (miroir de l'enum Prisma `Terrain`). */
export enum TerrainFilter {
  route = 'route',
  gravel = 'gravel',
  city = 'city',
  mtb = 'mtb',
}

/** Paramètres de requête pour lister les pneus. */
export class QueryTyresDto {
  /** Filtre par terrain. */
  @IsOptional()
  @IsEnum(TerrainFilter)
  terrain?: TerrainFilter;

  /** Filtre par marque (insensible à la casse). */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  brand?: string;

  /** Recherche plein-texte sur le nom de la gamme. */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  search?: string;

  /** Inclure les gammes en fin de vie (par défaut exclues). */
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDiscontinued?: boolean;
}
