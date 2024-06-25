import { Controller, Post, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry) {}
  private readonly logger = new Logger(BatchController.name);

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('cronSample');
    job.start();
    this.logger.log(`start!! ${job.lastDate()}`);
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');
    job.stop();
    this.logger.log(`stopped!! ${job.lastDate()}`);
  }
}
