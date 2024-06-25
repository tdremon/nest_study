import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';


@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // SchedulerRegistry 객체를 TaskService에 주입
  constructor(private schedulerRegistry: SchedulerRegistry) {
    // TaskService가 생성될 때 크론잡 하나를 SchedulerRegistry에 추가
    // SchedulerRegistry에 크론잡을 추가만 해두는 것이지 태스크 스케줄리에 등록하는 것은 아님!
    this.addCronJob();
  }

  addCronJob() {
    const name = 'cronSample';
    
    const job = new CronJob('* * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    this.logger.warn(`job ${name} added!`)
  }

  /** 14.2.1 크론 잡 선언 방식
  // App이 시작되고 3초뒤에 한번만 실행
  // @Cron(new Date(Date.now() + 3 * 1000))
  // 매주 월~금까지 새벽 1시에 수행
  // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM)
  @Cron('* * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('Task Called');
  }
  */

  /** 14.2.2 인터벌 선언 방식
  @Interval('intervalTask', 3000)
  handleCron() {
    this.logger.log('Task Called');
  }
  */

  /** 14.2.3 타임아웃 방식 : 1회용
  @Timeout('timeoutTask', 5000)
  handleCron() {
    this.logger.log('Task Called');
  }
  */
}


