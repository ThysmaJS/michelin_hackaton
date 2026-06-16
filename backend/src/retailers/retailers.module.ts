import { Module } from '@nestjs/common';
import { RetailersController } from './retailers.controller';
import { RetailersService } from './retailers.service';
import { GeoService } from './geo.service';

/** Module revendeurs : recherche de points de vente par localisation. */
@Module({
  controllers: [RetailersController],
  providers: [RetailersService, GeoService],
})
export class RetailersModule {}
