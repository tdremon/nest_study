import { Request } from 'express';
import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
// Nest가 제공하는 ConfigModule은 .env 파일에서 읽어온 환경 변수 값을 가져오는 프로바이더인
// ConfigService가 존재
import { ConfigService } from '@nestjs/config';

// prefix로 @Controller(app)이라고 했다면,
// http://localhost:3000/app/hello와 같이 Path가 입력됨
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  // 생략하면 기본이 '/'로 인식 됨
  // '/he*o'와 같이 wildcard도 사용 가능하다
  @Get('/hello')
  getHello(): string {
    console.log('hello');
    // return this.appService.getHello();
    return process.env.DATABASE_HOST;
  }

  // 요청과 함께 전달되는 데이터를 핸들러가 다룰 수 있는 객체로 변환함
  @Get('/helloworld')
  getHello2(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }

  // process.env를 통하지 않고 code에서 바로 가져올 수도 있음
  @Get('/db-host-from-config')
  getDatabaseHostFromConfig(): string {
    const db_host = this.configService.get('DATABASE_HOST');
    console.log(db_host);
    return db_host;
  }
}
