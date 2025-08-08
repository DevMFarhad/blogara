import config from '@/config';
import env from '@/config/env';
import nodemailer from 'nodemailer';
import ApiError from '../ApiError';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.nodemailer_app_mail,
    pass: env.nodemailer_app_pass,
  },
});

interface IMailPayload {
  from?: string;
  to?: string | string[];
  subject: string;
  body: string;
}

const sendMail = async ({ from, to, subject, body }: IMailPayload) => {
  try {
    if (Array.isArray(to)) {
      to = to.join(', ');
    }

    console.log({ to, subject, body });
    const info = await transporter.sendMail({
      from: from || `${config.app_name} <${config.email}>`,
      to: to || config.email,
      subject,
      html: body,
    });

    console.log('Message sent:', info.messageId);
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export default sendMail;
