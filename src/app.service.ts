import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(
  //   private readonly logger: Logger(AppService.name),
  // ) {}

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.error('This is a log error message');
    this.logger.warn('This is a log warn message');
    this.logger.log('This is a log log message');
    this.logger.verbose('This is a log verbose message');
    this.logger.debug('This is a log debug message');

    return 'Hello World!';
  }
}
