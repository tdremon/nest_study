// Nest 기술은 아니고 class-validator 영역이지만, 유효성 검사를 수행하는 데커레이터 생성 가능
import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function NotIn(property: string, validationOptions?: ValidationOptions) {
	// object : 데커레이터가 선언될 객체
	// propertyName : 데커레이터가 선언될 객체의 속성 이름
	return (object: Object, propertyName: string) => {
		// registerDecorator 함수는 ValidationDecoratorOptions 객체를 인수로 받음
		registerDecorator({
			name: 'NotIn',
			// 이 데커레이터는 객체가 생성될 때 적용됨
			target: object.constructor,
			propertyName,
			// 유효성 옵션은 데커레이터의 인수로 전달받은 것을 사용
			options: validationOptions,
			// 이 데커레이터는 속성에 적용되도록 제약을 줌
			constraints: [property],
			// 가장 중요한 유효성 검사 규칙이 validator 속성에 기술됨
			// 이는 ValidatorConstraintInterface를 구현한 함수
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return typeof value === 'string' && typeof relatedValue ==='string' &&!relatedValue.includes(value);
				},
			}	
		})
	}
}