import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService, EmailService],
})
export class UsersModule {}
