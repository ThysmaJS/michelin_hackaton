import { Controller, Get, Param, Query } from '@nestjs/common';
import { BikesService, BrandResponse, ModelResponse } from './bikes.service';
import { SearchQueryDto } from './dto/query-bikes.dto';

/** Endpoints d'autocomplétion des vélos (marques et modèles). */
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  /** `GET /api/bikes/brands?search=` — marques (autocomplétion). */
  @Get('brands')
  findBrands(@Query() query: SearchQueryDto): Promise<BrandResponse[]> {
    return this.bikesService.findBrands(query.search);
  }

  /** `GET /api/bikes/models/generic` — modèles génériques de repli. */
  @Get('models/generic')
  findGenericModels(): Promise<ModelResponse[]> {
    return this.bikesService.findGenericModels();
  }

  /** `GET /api/bikes/brands/:slug/models?search=` — modèles d'une marque. */
  @Get('brands/:slug/models')
  findModels(
    @Param('slug') slug: string,
    @Query() query: SearchQueryDto,
  ): Promise<ModelResponse[]> {
    return this.bikesService.findModelsByBrand(slug, query.search);
  }
}
