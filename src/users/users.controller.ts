import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Redirect, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const { name, email} = createUserDto;
    return `Create User. name: ${name}, email: ${email}`
    // original
    // return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Express를 사용하면 @Res 데커레이터를 이용하여 Express 응답 객체 취급 가능
  @Get('/express')
  findAllExpress(@Res() res) {
    const users = this.usersService.findAll();
    return res.status(200).send(users);
  }

  // Custom header를 추가하고 싶으면 다음과 같이
  // @Header('Custom', 'Test Header')
  // Redirection 시키고 싶으면 다음과 같이
  // @Redirect('http://nestjs.com', 301 | 302)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // id를 검사하여 Exception을 발생시키고 싶으면 아래와 같이 하면 됨
    // throw new BadRequestException(<some_string>)
    // throw new NotFoundException
    // status code가 자동으로 400 설정 됨
    return this.usersService.findOne(+id);
  }

  // Nest는 js 객체를 리턴하면 JSON 객체로 직렬화 해서 보냄으로 아래와 같이 하면됨
  @Get('redirect/docs')
  @Redirect('https://docs.nestjs.com', 302)
  // http://localhost:3000/users/redirect/docs?version=5
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  // res.status() 외에 간단하게 응답코드 설정 가능
  // @HttpCode(202)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // +id에 +가 붙은 이유는 param은 기본적으로 string으로 인식하기 때문에 숫자로 바꾸기 위함
    // Number(id), parseInt(str, id)와 같이 변환도 가능하지만 +가 편함
    return this.usersService.update(+id, updateUserDto);
  }

  // :id는 http://localhost:3000/users/1 이라고 하면 1에 해당
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // 라우트 매개변수를 전달 받는 방법은 2가지 있음
  // 1. 매개변수 여러개를 객체로 한번에 받는 방법 -> params 타입이 any가 되기 때문에 권장하지 않음
  // 2. 라우트 매개변수 타입이 항상 string이기 때문에 명시적으로 string 타입으로 받기
  @Delete(':userId/meemo/:memoId')
  deleteUserMemo(@Param() params: { [key: string]: string}) {
    return `userId: ${params.userId}, memoId: ${params.memoId}`;
  }
  // 더 일반적으로는 Param을 별도로 받기
  /*
  @Delete(':userId/meemo/:memoId')
  deleteUserMemo(
    @Param('userId') userId: string,
    @Param('memoId') memoId: string,
  ) {
    return 'userId: ${userId}, memoId: ${memoId}';
  }
  */
}
