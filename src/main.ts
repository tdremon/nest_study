import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { dot } from 'node:test/reporters';
import { logger3 } from './logger.middleware';

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
  // 모듈 전체에 미들웨어를 적용하기 위함
  app.use(logger3);
  // ValidationPipe를 모든 핸들러에 일일이 지정하지 않고 전역으로 설정하려면
  // 부트스트랩 과정에서 적용하면 됨
  app.useGlobalPipes(new ValidationPipe({
    // class-transformer가 적용되게 하려면 transform 속성을 true로 설정해야 함
    transform: true,
  }));
  await app.listen(3000);
}
bootstrap();
