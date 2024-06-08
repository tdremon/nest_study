import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class EmailService {

    private transporter: Mail;

    // 직접 주입하는 방법
    /*
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'veldi0510@gmail.com',
                pass: 'rhaehf2Wkd!',
            }
        })
    }
    */

    // ConfigModule을 사용하는 방법
    constructor(@Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
    ) {
        this.transporter = nodemailer.createTransport({
            service: this.config.service,
            auth: {
                user: this.config.auth.user,
                pass: this.config.auth.pass,
            }
        })
    }

    async sendMemberJoinEmail(emailAddress: string, signupVerifyToken: string) {
        const baseUrl = 'http://localhost:3000';
        // const baseUrl = this.config.baseUrl;
        const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
        const mailOption: EmailOptions = {
            to: emailAddress,
            subject: 'Success Signup',
            html: `Complete your signup by clicking this link.<br/>
                <form action="${url}" method="POST">
                    <button>Confirm signup</button>
                </form>
            `
        }
        
        return await this.transporter.sendMail(mailOption);
    }
}
