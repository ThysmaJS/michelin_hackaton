import { Module } from '@nestjs/common';
import { BikesController } from './bikes.controller';
import { BikesService } from './bikes.service';

/** Module vélos : marques et modèles pour l'autocomplétion du wizard. */
@Module({
  controllers: [BikesController],
  providers: [BikesService],
})
export class BikesModule {}
