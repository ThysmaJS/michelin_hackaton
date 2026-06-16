import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService, HealthStatus } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint de santé (`GET /api`). Exclu du rate limiting pour rester
   * interrogeable par les sondes même sous charge.
   */
  @Get()
  @SkipThrottle()
  getHealth(): Promise<HealthStatus> {
    return this.appService.getHealth();
  }
}
