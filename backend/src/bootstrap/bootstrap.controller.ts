import { Controller, Get } from '@nestjs/common';
import { BootstrapService, BootstrapData } from './bootstrap.service';

/** Endpoint agrégateur servant tout le contenu de la landing page en un appel. */
@Controller('bootstrap')
export class BootstrapController {
  constructor(private readonly bootstrapService: BootstrapService) {}

  /** `GET /api/bootstrap` — catalogue, vélos, guide, revendeurs et contenus UI. */
  @Get()
  getBootstrap(): Promise<BootstrapData> {
    return this.bootstrapService.getBootstrap();
  }
}
