import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { dot } from 'node:test/reporters';
import { logger3 } from './logger.middleware';
import { AuthGuard } from './auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger, WinstonModule, utilities as nestWinstonModuleUtilites } from 'nest-winston';
// import winston from 'winston/lib/winston/config';
import * as winston from 'winston';
// 13.1
// import { LoggingInterceptor } from './logging/logging.interceptor';
// 13.2
import { TransformInterceptor } from './transform.interceptor';

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

// 11.3.3 bootstrap까지 포함하여 내장 로거 대체하기
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: WinstonModule.createLogger({
//       transports: [
//         new winston.transports.Console({
//           level: process.env.NODE_ENV === 'prd' ? 'info' : 'silly',
//           format: winston.format.combine(
//             winston.format.timestamp(),
//             nestWinstonModuleUtilites.format.nestLike('MyApp', { prettyPrint: true }),
//           ),
//         }),
//       ],
//     })
//   });
//   await app.listen(3000);
// }


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 11.1.1 Logging disable
  // const app = await NestFactory.create(AppModule, { logger: false, });
  
  // 11.3.2 내장 로거 대체
  // 전역 로거 설정
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 13.2 응답과 예외 매핑
  app.useGlobalInterceptors(
    // new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // 10.2.2 : 전역으로 Guard를 적용하고 싶은 경우
  // app.useGlobalGuards(new AuthGuard());
  // 모듈 전체에 미들웨어를 적용하기 위함
  // ValidationPipe를 모든 핸들러에 일일이 지정하지 않고 전역으로 설정하려면
  // 부트스트랩 과정에서 적용하면 됨
  app.useGlobalPipes(new ValidationPipe({
    // class-transformer가 적용되게 하려면 transform 속성을 true로 설정해야 함
    transform: true,
  }));

  // 허가되지 않은 인증서를 거부하지 않겠다
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  await app.listen(3000);
}
bootstrap();
