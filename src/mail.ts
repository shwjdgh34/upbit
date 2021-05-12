import { Logger } from '@nestjs/common';
import { emailConfigs } from './config';
const nodemailer = require("nodemailer");

export class Mail {
  static readonly logger = new Logger(Mail.name);

  static send(name: string, currentPrice: number, lowestPrice: number) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailConfigs.senderId,
        pass: emailConfigs.senderPw,
      },
    });

    // send mail with defined transport object
    transporter.sendMail({
      from: `🔥떡상 가즈아🔥 <${emailConfigs.senderId}>`, // sender address
      to: emailConfigs.receiverId, // list of receivers
      subject: `Rising ${name}`, // Subject line
      // text: "Hello world?", // plain text body
      html: `<b>상승률: ${Math.floor((currentPrice / lowestPrice - 1) * 100)}%</b><br><b>현재가격: ${currentPrice}</b><br><b>최근 최저가격: ${lowestPrice}</b>`, // html body
    });

    this.logger.log("Sent Mail")
  }

}
