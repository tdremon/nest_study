import { Controller, Post, Body, Query, Get, Param, Headers, UseGuards, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './users.interface';
import { UsersService } from './users.service';
import { ValidationPipe } from '../validation.pipe';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth.guard';
// 11.3.1 nest-winston 적용
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		// 11.3.1 nest-winston 적용
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
	) {}

	// @Get()
	// test(): string {
	// 	return 'Server is running';
	// }

	@Post()
	async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
		this.printWinstonLog(dto);
		const { name, email, pass} = dto;
		await this.usersService.createUser(name, email, pass);
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

	@UseGuards(AuthGuard)
	@Get(':id')
	async getUserInfo(@Headers() headers: any, @Param('id') userId: string ): Promise<UserInfo> {
		// JWT 토큰의 유효성 검사를 모두 endpoint에서 중복 구현하고 있음
		// 매우 비효율적이고 DRY(Don't Repeat Yourself!) 원칙에도 위배
		/*
		const jwtString = headers.authorization.split('Bearer ')[1];
		this.authService.verify(jwtString);
		return this.usersService.getUserInfo(userId);
		*/

		// @UseGuards(AuthGuard)를 통해 
		return this.usersService.getUserInfo(userId);
	}

	private printWinstonLog(dto): void {
		// console.log(this.logger.name);

		this.logger.error('error: ', dto);
		this.logger.warn('warn: ', dto);
		this.logger.info('info: ', dto);
		this.logger.http('http: ', dto);
		this.logger.verbose('verbose: ', dto);
		this.logger.debug('debug: ', dto);
		this.logger.silly('silly: ', dto);
	}
}
