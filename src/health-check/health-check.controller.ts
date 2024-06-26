import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkHttp() {
    return this.health.check([
      // () => this.http.pingCheck('nestjs-docs', 'https://www.naver.com'),
      () => this.db.pingCheck('database'),
    ]);
  }
}
