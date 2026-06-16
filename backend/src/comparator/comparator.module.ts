import { Module } from '@nestjs/common';
import { ComparatorController } from './comparator.controller';
import { ComparatorService } from './comparator.service';

/** Module comparateur : confrontation de deux pneus sur leurs métriques clés. */
@Module({
  controllers: [ComparatorController],
  providers: [ComparatorService],
})
export class ComparatorModule {}
