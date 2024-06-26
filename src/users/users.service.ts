import * as uuid from 'uuid';
import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
// 가능한 상대 경로보다 절대 경로를 사용하는 것이 좋은 듯
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './users.interface';
import { UserEntity } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthService } from'src/auth/auth.service';


@Injectable()
export class UsersService {
    // EmailService를 주입
    constructor(
        private readonly emailService: EmailService,
        // @InjectRepository 데커레이터로 유저 저장소를 주입
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        // 객체에 트랜잭션을 생성할 DataSource를 typeorm으로부터 가져와서 주입
        private dataSource: DataSource,
        private authService: AuthService,
    ) {}


    async createUser(name: string, email: string, password: string) {
        const userExist = await this.checkUserExists(email);
        console.log(`userExist : ${userExist}`);
        if (userExist) {
            throw new UnprocessableEntityException('User already exists');
        }

        const signupVerifyToken = uuid.v1();

        // await this.saveUser(name, email, password, signupVerifyToken)
        // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken)
        await this.saveUserUsingTransaction(name, email, password, signupVerifyToken)

        
        // await this.sendMemberJoinEmail(email, signupVerifyToken)
    }

    // 8.3
    private async checkUserExists(emailAddress: string) {
        console.log("checkUserExists");
        const user = await this.usersRepository.findOne({
            where: { email: emailAddress }
        });
        console.log(`user : ${user}`);
        return user != undefined;
    }

    // 8.3
    private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
        console.log("saveUser");
        const user = new UserEntity();
        user.id = ulid();
        user.name = name;
        user.email = email;
        user.password = password;
        user.signupVerifyToken = signupVerifyToken;
        await this.usersRepository.save(user);
    }

    // 8.4 트랜잭션
    private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
        // 주입받은 DataSource 객체에서 QueryRunner를 생성
        const queryRunner = this.dataSource.createQueryRunner();

        // queryRunner에서 DB에 연결 후 트랜잭션을 시작
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await queryRunner.manager.save(user);
            // throw new InternalServerErrorException();
            await queryRunner.commitTransaction();
        } catch (e) {
            // error가 발생하면 roll-back
            await queryRunner.rollbackTransaction();
        } finally {
            // 직접 생성한 QueryRunner 해제시켜줘야 함
            await queryRunner.release();
        }
    }

    private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
        // transaction 메서드는 주어진 함수 실행을 트랜잭션으로 래핑함
        // 모든 데이터베이스 연산은 제공된 엔티티 매니저를 이용하여 실행
        // transcation 내부에서 Exception 발생 시, 자동으로 Rollback을 하는 듯? -> 확인필요!
        await this.dataSource.transaction(async manager => {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await manager.save(user);

            throw new InternalServerErrorException();
        })
    }

    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        console.log("sendMemberJoinEmail");
        await this.emailService.sendMemberJoinEmail(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
        console.log("verifyEmail");
        
        const user = await this.usersRepository.findOne({
            where: { signupVerifyToken }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        })

        // throw new Error("Method not implemented.")
    }

    async login(email: string, password: string): Promise<string> {
        console.log("login");

        const user = await this.usersRepository.findOne({
            where: { email, password }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        })

        // throw new Error('Method not implemented.');
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        console.log("getUserInfo");

        const user = await this.usersRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        }

        // throw new Error('Method not implemented.');
    }
}
