import { Module } from '@nestjs/common';
import { TyresController } from './tyres.controller';
import { TyresService } from './tyres.service';

/** Module catalogue : consultation des gammes et variantes de pneus. */
@Module({
  controllers: [TyresController],
  providers: [TyresService],
  exports: [TyresService],
})
export class TyresModule {}
