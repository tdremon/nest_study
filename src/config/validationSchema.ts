// ConfigModuleOptions의 변수로 자세한 내용은 ConfigModule > ConfigModuleOptions 참조
import * as Joi from 'joi';

export const validationSchema = Joi.object({
    EMAIL_SERVICE: Joi.string().required(),
    EMAIL_AUTH_USER: Joi.string().required(),
    EMAIL_AUTH_PASS: Joi.string().required(),
    EMAIL_BASE_URL: Joi.string().required().uri(),
})