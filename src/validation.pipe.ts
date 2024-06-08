import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// 기본적으로는 Nest가 만들어 놓은 ValidationPipe를 사용하면 됨. @nestjs/common에 있음
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}