import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from "@nestjs/common";
import { timeStamp } from "console";
import { Request, Response } from "express";
import { Logger } from "@nestjs/common";
import { exceptions } from "winston";

// 처리되지 않은 모든 예외를 잡으려고 할 때 사용
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    // Nest에서 이미 HttpException은 컨트롤을 해주고 있으니 나머지 Exception에 대해서
    // InternalServerErrorException로 처리
    const response = (exception as HttpException).getResponse();

    const log = {
      timeStamp: new Date(),
      url: req.url,
      response,
    }

    this.logger.log(log);
    // console.log(log);

    res
      .status((exception as HttpException).getStatus())
      .json(response);
  }
}