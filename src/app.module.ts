import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from "./config/validationSchema";

@Module({
  //// ConfigModule.forRoot()
  // forRoot()는 DynamicModule을 리턴하는 정적 메서드
  // 동적 모듈을 작성할 때 아무 이름을 써도 되지만 관례적으로 forRoot, register를 씀
  // 비동기 함수일 경우 forRootAsync, registerAsync를 사용
  imports: [AppModule, UsersModule, EmailModule,
    ConfigModule.forRoot({
			// envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      envFilePath: [`src/config/env/.${process.env.NODE_ENV}.env`],
			// load 속성을 통해 앞에서 구성해둔 ConfigFactory를 지정
			load: [emailConfig],
			// 전역 모듈로 동작하게 함
			// 필요하다면 EmailModule에만 임포트 하면 됨
			isGlobal: true,
			// 환경 변수의 값에 대한 유효성 검사를 수행하도록 Joi 라이브러리르 이용한 검사 객체
			validationSchema,
		})
    // ConfigModule.forRoot({
    //   envFilePath: (process.env.NODE_ENV === 'prd')? '.prd.env'
    //   : (process.env.NODE_ENV ==='stg')? '.stg.env'
    //   : '.dev.env'
    // })
  ],
  // 3.1.8 하위 도메인 라우팅
  // ApiController가 먼저 처리되도록 순서를 수정
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
