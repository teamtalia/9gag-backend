import { SendMailOptions } from 'nodemailer';
import mailer from '../../config/mailer';

import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import PasswordReset from '../../models/PasswordReset';

interface Request {
  user: User;
  passwordReset: PasswordReset;
}

interface HBSProps extends SendMailOptions {
  template: string;
  context: any;
}

class SendUserEmailVerification {
  public async execute({ user, passwordReset }: Request): Promise<boolean> {
    try {
      await mailer.sendMail({
        to: user.email,
        template: 'password.reset',
        subject: 'Reset Password Code',
        context: {
          code: passwordReset.code,
          name: user.fullname,
        },
      } as HBSProps);
      return true;
    } catch (err) {
      throw new ServiceError(`error on send email to reset password: ${err}`);
    }
  }
}

export default SendUserEmailVerification;
