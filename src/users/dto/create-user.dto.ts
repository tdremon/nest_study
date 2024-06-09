import { IsString, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { NotIn } from '../../not-in';

export class CreateUserDto {
	// 인수의 속성의 값(value)과 그 속성을 가지고 있는 객체(obj) 등을 인수로 받아
	// 속성을 변형한 후 리턴하는 함수
	@Transform(params => {
		console.log(params);
		return params.value;
	})
	// password는 name과 동일한 문자열을 포함수 없게 한다면
	// @Transform(({ value, obj }) => {
	// 	if (obj.password.includes(obj.name.trim())) {
	// 		throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.')
	// 	}
	// 	return value.trim();
	// })
	@NotIn('pass', { message: 'password는 name과 같은 문자열을 포함할 수 없습니다.' })
	@IsString()
	@MinLength(2)
	@MaxLength(30)
	readonly name: string;
	@IsString()
	@IsEmail()
	@MaxLength(60)
	readonly email: string;
	@IsString()
	@Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
	readonly pass: string;
}