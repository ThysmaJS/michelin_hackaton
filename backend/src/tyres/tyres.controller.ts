import { Controller, Get, Param, Query } from '@nestjs/common';
import { TyresService } from './tyres.service';
import { QueryTyresDto } from './dto/query-tyres.dto';
import { TyreDetail, TyreSummary } from './dto/tyre-response';

/** Endpoints de consultation du catalogue de pneus. */
@Controller('tyres')
export class TyresController {
  constructor(private readonly tyresService: TyresService) {}

  /** `GET /api/tyres` — liste filtrable des gammes. */
  @Get()
  findAll(@Query() query: QueryTyresDto): Promise<TyreSummary[]> {
    return this.tyresService.findAll(query);
  }

  /** `GET /api/tyres/competitors` — gammes concurrentes (comparateur). */
  @Get('competitors')
  findCompetitors(): Promise<TyreSummary[]> {
    return this.tyresService.findCompetitors();
  }

  /** `GET /api/tyres/:slug` — détail d'une gamme avec ses variantes. */
  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<TyreDetail> {
    return this.tyresService.findBySlug(slug);
  }
}
