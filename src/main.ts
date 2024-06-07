import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { dot } from 'node:test/reporters';

//// Nodejs 방식의 dotenv
// dotenv 환경을 설정
// Nestjs 방식은 app.modules.ts에 정의

// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV === 'prd') ? '.prd.env'
//       : (process.env.NODE_ENV === 'stg') ? '.stg.env'
//       : '.dev.env'
//   )
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
