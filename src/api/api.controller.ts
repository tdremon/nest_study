import { Controller, Get, HostParam } from '@nestjs/common';

// original
// @Controller('api')
// 하위 도메인 요청 처리 설정
// Linux의 경우 /etc/hosts에 127.0.0.1 api.localhost 를 추가해 줘야 함
@Controller({ host: ':version.api.example.com' })
export class ApiController {

    @Get()
    index(): string {
        return 'Hello API!';
    }

    // @Param 데커레이터를 통해 요청 패스를 변수로 받아 동적으로 처리하듯이
    // @HostParam 데커레이터를 이용하면 서브 도메인을 변수로 받을 수 있음
    @Get()
    indexVersion(@HostParam('version') version: string): string {
        return `Hello API v${version}!`;
    }

}
