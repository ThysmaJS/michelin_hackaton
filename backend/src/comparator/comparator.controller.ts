import { Controller, Get, Query } from '@nestjs/common';
import { ComparatorService, ComparisonResult } from './comparator.service';
import { QueryComparatorDto } from './dto/query-comparator.dto';

/** Endpoint du comparateur rapide. */
@Controller('comparator')
export class ComparatorController {
  constructor(private readonly comparatorService: ComparatorService) {}

  /** `GET /api/comparator?left=&right=` — confronte deux pneus. */
  @Get()
  compare(@Query() query: QueryComparatorDto): Promise<ComparisonResult> {
    return this.comparatorService.compare(query.left, query.right);
  }
}
