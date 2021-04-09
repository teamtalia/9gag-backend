import { SendMailOptions } from 'nodemailer';
import mailer from '../../config/mailer';

import ServiceError from '../../util/ServiceError';
import User from '../../models/User';

interface Request {
  user: User;
}

interface HBSProps extends SendMailOptions {
  template: string;
  context: any;
}

class SendUserEmailVerification {
  public async execute({ user }: Request): Promise<boolean> {
    try {
      await mailer.sendMail({
        to: user.email,
        template: 'verification.user',
        subject: 'Verificação de e-mail',
        context: {
          code: user.verificationCode,
          name: user.fullname,
        },
      } as HBSProps);
      return true;
    } catch (err) {
      throw new ServiceError(`Erro ao criar usuário: ${err}`);
    }
  }
}

export default SendUserEmailVerification;
