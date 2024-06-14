import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('Request...');
        // next를 주석처리 하거나, res.send('DONE')과 같이 반환을 하면 Hang 걸림
        next();
    }
}