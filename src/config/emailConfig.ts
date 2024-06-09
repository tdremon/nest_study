// env 파일에 선언된 환경 변수들을 emailConfig에서 의미 있는 값으로
// 묶어서 관리할 수 있게 해줌
import { registerAs } from "@nestjs/config"

// 쉽게 설명하면 'email'이라는 토큰으로 ConfigFactory를 등록할 수 있는 함수라고 이해하면 됨
export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth : {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}))