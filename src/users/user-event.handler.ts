import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EmailService } from "src/email/email.service";
import { UserCreatedEvent } from "./event/user-create.event";
import { TestEvent } from "./event/test.evnet";

@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent | TestEvent> {
    constructor(
        private emailService: EmailService,
    ) {}

    async handle(event: UserCreatedEvent | TestEvent) {
        switch (event.name) {
            case UserCreatedEvent.name: {
                console.log('UserCreateEvent!');
                const { email, signupVerifyToken } = event as UserCreatedEvent;
                await this.emailService.sendMemberJoinEmail(email, signupVerifyToken);
                break;
            }
            case TestEvent.name: {
                console.log('TestEvent!');
                break;
            }
            default:
                break;
        }
    }
}