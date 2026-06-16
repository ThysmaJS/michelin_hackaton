import { IsOptional, IsString, MaxLength } from 'class-validator';

/** Paramètre de recherche partagé pour l'autocomplétion marques/modèles. */
export class SearchQueryDto {
  /** Texte saisi par l'utilisateur (filtre insensible à la casse). */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  search?: string;
}
