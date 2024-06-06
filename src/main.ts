import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { dot } from 'node:test/reporters';

// dotenv 환경을 설정
dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'prd') ? '.prd.env'
      : (process.env.NODE_ENV === 'stg') ? '.stg.env'
      : '.dev.env'
  )
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
