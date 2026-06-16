import { Module } from '@nestjs/common';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';

/** Module Guide : régions cyclables et parcours éditoriaux. */
@Module({
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
