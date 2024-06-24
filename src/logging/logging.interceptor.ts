import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
// Interceptor는 NestInterceptor 인터페이스를 구현한 클래스
export class LoggingInterceptor implements NestInterceptor {
  constructor (private logger: Logger ){};
  // NestInterceptor 인터페이스는 intercept method를 구현해야 함
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...');
    // 13.3
    // 실행 콘텍스트에 포함된 첫 번째 객체로부터 요청 정보를 얻어 올 수 있음
    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`Request to ${method} ${url}`);
    
    const now = Date.now();
    return next
      .handle()
      .pipe(
        // tap(() => console.log(`After...${Date.now() - now}ms`)),
        tap(data => this.logger.log(`Response from ${method} ${url} \n response: ${JSON.stringify(data)}`)),
      );
  }
}