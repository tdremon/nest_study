import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { TestEvent } from '../event/test.evnet';
import { UserCreatedEvent } from '../event/user-create.event';

import * as uuid from 'uuid';
// 가능한 상대 경로보다 절대 경로를 사용하는 것이 좋은 듯
import { EmailService } from 'src/email/email.service';
import { UserInfo } from '../users.interface';
import { UserEntity } from '../entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthService } from'src/auth/auth.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly emailService: EmailService,
        // @InjectRepository 데커레이터로 유저 저장소를 주입
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        // 객체에 트랜잭션을 생성할 DataSource를 typeorm으로부터 가져와서 주입
        private dataSource: DataSource,
        private authService: AuthService,
        private eventBus: EventBus,
    ) {}

    async execute(command: CreateUserCommand) {
        const { name, email, password } = command;

        const userExist = await this.checkUserExists(email);
        console.log(`This is User Command Handler!! : ${userExist}`);
        if (userExist) {
            throw new UnprocessableEntityException('User already exists');
        }

        const signupVerifyToken = uuid.v1();

        // await this.saveUser(name, email, password, signupVerifyToken)
        // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken)
        await this.saveUserUsingTransaction(name, email, password, signupVerifyToken)

        this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
        this.eventBus.publish(new TestEvent());
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
}