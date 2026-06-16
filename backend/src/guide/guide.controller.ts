import { Controller, Get, Param, Query } from '@nestjs/common';
import { GuideService, RegionResponse } from './guide.service';
import { RouteDetail, RouteSummary } from './dto/guide-response';
import { QueryRoutesByTyreDto } from './dto/query-routes.dto';

/** Endpoints du Guide Michelin (régions et parcours). */
@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  /** `GET /api/guide/regions` — régions disponibles. */
  @Get('regions')
  findRegions(): Promise<RegionResponse[]> {
    return this.guideService.findRegions();
  }

  /** `GET /api/guide/regions/:key/routes` — parcours d'une région. */
  @Get('regions/:key/routes')
  findRoutesByRegion(@Param('key') key: string): Promise<RouteSummary[]> {
    return this.guideService.findRoutesByRegion(key);
  }

  /** `GET /api/guide/routes?tyre=` — parcours recommandant un pneu donné. */
  @Get('routes')
  findRoutesByTyre(
    @Query() query: QueryRoutesByTyreDto,
  ): Promise<RouteSummary[]> {
    return this.guideService.findRoutesByTyre(query.tyre);
  }

  /** `GET /api/guide/routes/:title` — détail éditorial d'un parcours. */
  @Get('routes/:title')
  findRoute(@Param('title') title: string): Promise<RouteDetail> {
    return this.guideService.findRouteByTitle(title);
  }
}
