import { Controller, Post, Body, Query, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './users.interface';

@Controller('users')
export class UsersController {

	@Post()
	async createUser(@Body() dto: CreateUserDto): Promise<void> {
		console.log(dto);
	}

	@Post('/email-verify')
	async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {;
		console.log(dto);
		return;
	}

	@Post('/login')
	async login(@Body() dto: UserLoginDto): Promise<string> {
		console.log(dto);
		return;
	}

	@Get('/:id')
	async getUser(@Param('id') userId: string): Promise<UserInfo> {
		console.log(userId);
		return;
	}
}
