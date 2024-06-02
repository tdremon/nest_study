import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';

@Module({
  imports: [UsersModule],
  // 3.1.8 하위 도메인 라우팅
  // ApiController가 먼저 처리되도록 순서를 수정
  controllers: [ApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
