import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.getOrThrow<string>('EMAIL_USER'),
        clientId: this.configService.getOrThrow<string>('OAUTH_CLIENT_ID'),
        clientSecret: this.configService.getOrThrow<string>(
          'OAUTH_CLIENT_SECRET',
        ),
        refreshToken: this.configService.getOrThrow<string>(
          'OAUTH_REFRESH_TOKEN',
        ),
      },
    });
  }
  async notifyEmail({ email, text }: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('EMAIL_USER'),
      to: email,
      subject: 'Your reservation is confirmed',
      text,
      html: `<p>${text}</p>`,
    });
  }
}
