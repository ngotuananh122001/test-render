import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendNotification(message: string) {

    try {

      await this.mailerService.sendMail({
        to: process.env.MAIL_RECEIVED_ADDRESS,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Please check bridge system',
        template: './notification', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          name: "Alex",
          content: message
        },
      });
    } catch (error) { }
  }

  async sendResetPassword(email: string, subject: string, resetPwdURL: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: __dirname + '/templates/resetPassword',
        context: {
          resetPwdURL
        },
      });
    } catch (error) { console.log('error: ', error.message) }
  }

  async sendMail(email: string, subject: string, fullname: string, message: string) {

    try {

      await this.mailerService.sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: subject,
        // template: './notification', // `.hbs` extension is appended automatically
        template: __dirname + '/templates/notification',
        context: { // ✏️ filling curly brackets with content
          name: fullname || "You",
          content: message
        },
      });
    } catch (error) { console.log('error: ', error.message) }
  }

  async sendSubscriber(email: string, subject: string, key: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        // from: 'Welcome to Verdant NFT!', // override default from
        subject: subject,
        // template: './notification', // `.hbs` extension is appended automatically
        template: __dirname + '/templates/subscription',
        context: { // ✏️ filling curly brackets with content
          host: process.env.URL_BACKEND,
          email,
          key,
        },
      });
    } catch (error) { console.log('error: ', error.message) }
  }

  async sendBlackLister(email: string, subject: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        // from: 'Welcome to Verdant NFT!', // override default from
        subject: subject,
        // template: './notification', // `.hbs` extension is appended automatically
        template: __dirname + '/templates/blacklist',
        context: { // ✏️ filling curly brackets with content
          name
        },
      });
    } catch (error) { console.log('error: ', error.message) }
  }


  async sendOTPVerification(email: string, subject: string, code: string) {
    try {
      console.log("email", email);
      console.log("subject", subject);
      console.log("code", code);
      console.log("template", __dirname);
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: __dirname + '/templates/otpVerification',
        context: {
          code
        },
      });
    } catch (error) { console.log('error: ', error.message) }
  }

  async sendStrangeLogin(email: string, subject: string, data: any) {

    try {
      await this.mailerService.sendMail({
        to: email,
        // from: 'Welcome to Verdant NFT!', // override default from
        subject: subject,
        // template: './notification', // `.hbs` extension is appended automatically
        template: __dirname + '/templates/strangeLogin',
        context: { // ✏️ filling curly brackets with content
          name: data.fullname || "You",
          time: data.time,
          location: data.location,
          url_ok: data.url_ok,
          url_reject: data.url_reject
        },
      });
    } catch (error) { console.log('error: ', error.message) }
  }
}