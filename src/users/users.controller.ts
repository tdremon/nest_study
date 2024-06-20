import { Controller, Post, Body, Query, Get, Param, Headers, UseGuards, Inject, InternalServerErrorException, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './users.interface';
import { UsersService } from './users.service';
import { ValidationPipe } from '../validation.pipe';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth.guard';
// 11.3.1 nest-winston 적용
// import { Logger as WinstonLogger } from 'winston';

// 11.3.3
import { Logger } from '@nestjs/common';

import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from '../exception/http-exception.filter';

@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		// 11.3.1 nest-winston 적용
		// @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
		
		// 11.3.2 내장 로거
		// 로깅을 하고자 하는 곳에서 LoggerService를 WINSTON_MODULE_NEST_PROVIDER 토근으로 주입
		// @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,

		// 11.3.3
		@Inject(Logger) private readonly logger: LoggerService,
	) {}

	// @Get()
	// test(): string {
	// 	return 'Server is running';
	// }

	// 12.2 Exception Filter
	@UseFilters(HttpExceptionFilter)
	@Post()
	async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
		// this.printWinstonLog(dto);
		this.printLoggerServiceLog(dto);
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

		// this.logger.error('error: ', dto);
		// this.logger.warn('warn: ', dto);
		// this.logger.info('info: ', dto);
		// this.logger.http('http: ', dto);
		// this.logger.verbose('verbose: ', dto);
		// this.logger.debug('debug: ', dto);
		// this.logger.silly('silly: ', dto);
	}

	/*
	LoggerService가 제공하는 Log level은 winstone과 비교해서 제한적
	LoggerService는 WinstonLogger와 다르게 인수로 받은 객체를 메시지로 출력하지 않음
	내용을 출력하기 위해서는 메시지에 포함해야 함. 그래서 dto를 string으로 변환해야 함
	*/
	private printLoggerServiceLog(dto): void {
		try {
			throw new InternalServerErrorException('test');
		} catch (e) {
			this.logger.error('error: '+ JSON.stringify(dto), e.stack);
		}
		this.logger.warn('warn: '+ JSON.stringify(dto));
		this.logger.log('log: '+ JSON.stringify(dto));
		this.logger.verbose('verbose: '+ JSON.stringify(dto));
		this.logger.debug('debug: '+ JSON.stringify(dto));
	}
}
