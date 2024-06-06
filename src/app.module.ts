import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  // 3.1.8 하위 도메인 라우팅
  // ApiController가 먼저 처리되도록 순서를 수정
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
