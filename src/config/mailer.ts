import { createTransport, SendMailOptions } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

const mailer = createTransport({
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
});

mailer.use(
  'compile',
  hbs({
    viewEngine: {
      layoutsDir: resolve(__dirname, '..', 'mails'),
      partialsDir: resolve(__dirname, '..', 'mails'),
    },
    viewPath: resolve(__dirname, '..', 'mails'),
  }),
);

export default mailer;
