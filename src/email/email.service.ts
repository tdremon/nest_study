import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class EmailService {

    private transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'veldi0510@gmail.com',
                pass: 'rhaehf2Wkd!',
            }
        })
    }

    async sendMemberJoinEmail(emailAddress: string, signupVerifyToken: string) {
        const baseUrl = 'http://localhost:3000';
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
