import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
// 가능한 상대 경로보다 절대 경로를 사용하는 것이 좋은 듯
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './users.interface';

@Injectable()
export class UsersService {
    // EmailService를 주입
    constructor(private readonly emailService: EmailService) {}


    async createUser(name: string, email: string, password: string) {
        await this.checkUserExists(email);

        const signupVerifyToken = uuid.v1();

        await this.saveUser(name, email, password, signupVerifyToken)
        await this.sendMemberJoinEmail(email, signupVerifyToken)
    }

    private checkUserExists(email: string) {
        console.log("checkUserExists");
        return false; // TODO : after DB is ready
    }

    private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
        console.log("saveUser");
        return; // TODO : after DB is ready
    }

    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        console.log("sendMemberJoinEmail");
        await this.emailService.sendMemberJoinEmail(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
        console.log("verifyEmail");
        // TODO
        // 1. DB에서 signupVerifyToken으로 회원가입 처리 중인 유저가 있는지 조회하고 없다면 에러 처리
        // 2. 바로 로그인 사태가 되도록 JWT 발급
        throw new Error("Method not implemented.")
    }

    async login(email: string, password: string): Promise<string> {
        // TODO
        // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        // 2. JWT를 발급

        throw new Error('Method not implemented.')
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        // TODO
        // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        // 2. 조회된 데이터를 UserInfo 타입으로 응답

        throw new Error('Method not implemented.')
    }
}
