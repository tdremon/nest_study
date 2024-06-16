import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    // forFeature() 메서드로 유저 모듈 내에서 사용할 저장소를 등록
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
