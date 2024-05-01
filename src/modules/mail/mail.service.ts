import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRequestResetPassword(user: User, url: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Request forgot password of you from OP School!',
      template: './requestForgotPassword',
      context: {
        name: user.nickname,
        url,
      },
    });
  }

  async sendResetPassword(user: User, url: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password successfully',
      template: './resetPassword',
      context: {
        name: user.nickname,
        url,
      },
    });
  }
}
