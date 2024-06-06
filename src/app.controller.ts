import { Request } from 'express';
import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

// prefix로 @Controller(app)이라고 했다면,
// http://localhost:3000/app/hello와 같이 Path가 입력됨
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 생략하면 기본이 '/'로 인식 됨
  // '/he*o'와 같이 wildcard도 사용 가능하다
  @Get('/he*o')
  getHello(): string {
    return this.appService.getHello();
  }

  // 요청과 함께 전달되는 데이터를 핸들러가 다룰 수 있는 객체로 변환함
  @Get('/helloworld')
  getHello2(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }
}
