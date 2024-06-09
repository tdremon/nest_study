import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from "./config/validationSchema";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';

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
		}),
    // ConfigModule.forRoot({
    //   envFilePath: (process.env.NODE_ENV === 'prd')? '.prd.env'
    //   : (process.env.NODE_ENV ==='stg')? '.stg.env'
    //   : '.dev.env'
    // })
    TypeOrmModule.forRoot({
      type:'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      // 소스코드 내에서 TypeORM이 구동될 때 인식하도록 할 엔티티(Entity) 클래스의 경로를 지정
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [UserEntity],
      // 서비스 구동 시 소스 코드 기반으로 DB shcema를 동기호할지 여부
      // local 환경에서 구동할 때는 개발의 편의를 위해 true
      // Production에서는 DB가 초기화 됨으로 절대로 true 금지!!
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
  ],
  // 3.1.8 하위 도메인 라우팅
  // ApiController가 먼저 처리되도록 순서를 수정
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
