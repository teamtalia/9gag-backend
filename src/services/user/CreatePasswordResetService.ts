/* eslint-disable no-await-in-loop */
import { getRepository, getManager } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import PasswordReset from '../../models/PasswordReset';
import SendUserEmailPasswordReset from '../auth/SendUserEmailPasswordReset';

interface Request {
  email: string;
}

class CreatePasswordResetService {
  public async execute({ email }: Request): Promise<boolean> {
    const userRepository = getRepository(User);
    const passwordResetRepository = getRepository(PasswordReset);
    const mailService = new SendUserEmailPasswordReset();

    const userExits = await userRepository.findOne({
      relations: ['passwordResets'],
      where: { email },
    });

    if (!userExits) {
      throw new ServiceError('Email not registered.', 400);
    }
    if (userExits.password === null) {
      throw new ServiceError(
        'Accounts created by google are not allowed to reset the password.',
        400,
      );
    }
    let code;
    if (userExits.passwordResets.length) {
      const reset = userExits.passwordResets[0];
      code = reset.code;
      try {
        const sended = await mailService.execute({
          user: userExits,
          passwordReset: reset,
        });
        return sended;
      } catch (err) {
        throw new ServiceError(`error on generate password reset: ${err}`);
      }
    } else {
      do {
        code = Math.random().toString(36).substring(6);
        const passwordResetVerification = await passwordResetRepository.findOne(
          {
            where: { code },
          },
        );
        if (!passwordResetVerification) {
          break;
        }
      } while (true);
    }

    const createdAt = new Date();
    const updatedAt = new Date();
    const expireAt = new Date();

    const passwordResetData = passwordResetRepository.create({
      code,
      createdAt,
      updatedAt,
      expireAt,
      user: userExits,
    });
    try {
      return (await getManager().transaction(
        async transactionalEntityManager => {
          const passwordReset = await transactionalEntityManager.save(
            passwordResetData,
          );
          try {
            const sended = await mailService.execute({
              user: userExits,
              passwordReset,
            });
            return sended;
          } catch (err) {
            transactionalEntityManager.release();
            throw err;
          }
        },
      )) as boolean;
    } catch (err) {
      throw new ServiceError(`error on generate password reset: ${err}`);
    }
  }
}

export default CreatePasswordResetService;
