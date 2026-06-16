import { Controller, Get, Query } from '@nestjs/common';
import { RetailersService, RetailerSearchResult } from './retailers.service';
import { QueryRetailersDto } from './dto/query-retailers.dto';

/** Endpoint de localisation des revendeurs. */
@Controller('retailers')
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  /** `GET /api/retailers?postal=&tyre=` — revendeurs proches de la localisation. */
  @Get()
  search(@Query() query: QueryRetailersDto): Promise<RetailerSearchResult> {
    return this.retailersService.search(query.postal);
  }
}
