import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      auth: {
        user: configService.get<string>('MAIL_AUTH_USER'),
        pass: configService.get<string>('MAIL_AUTH_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:4200/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Tuneful',
      to: to,
      subject: 'Password reset request',
      html: `<p>You have requested a password reset. Click the link to reset your password: </p><a href='${resetLink}'>Password reset</a>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
