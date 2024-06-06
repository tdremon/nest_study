import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AppModule, UsersModule, EmailModule],
  // 3.1.8 하위 도메인 라우팅
  // ApiController가 먼저 처리되도록 순서를 수정
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
