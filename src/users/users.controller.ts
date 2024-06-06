import { Controller, Post, Body, Query, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	// @Get()
	// test(): string {
	// 	return 'Server is running';
	// }

	@Post()
	async createUser(@Body() dto: CreateUserDto): Promise<void> {
		console.log(dto);
		const { name, email, password} = dto;
		await this.usersService.createUser(name, email, password);
	}

	@Post('/email-verify')
	async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {;
		console.log(dto);
		const { signupVerifyToken } = dto;
		return await this.usersService.verifyEmail(signupVerifyToken);
	}

	@Post('/login')
	async login(@Body() dto: UserLoginDto): Promise<string> {
		console.log(dto);
		const { email, password } = dto;
		return await this.usersService.login(email, password);
	}

	@Get('/:id')
	async getUser(@Param('id') userId: string): Promise<UserInfo> {
		console.log(userId);
		return await this.usersService.getUserInfo(userId);
	}
}
