/* eslint-disable no-await-in-loop */
import { getRepository, getManager } from 'typeorm';
import { hash } from 'bcrypt';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import PasswordReset from '../../models/PasswordReset';
import authConfig from '../../config/auth';

interface Request {
  code: string;
  password: string;
  passwordConfirm: string;
}

class ResetUserPasswordService {
  public async execute({
    code,
    password,
    passwordConfirm,
  }: Request): Promise<void> {
    const userRepository = getRepository(User);
    const passwordResetRepository = getRepository(PasswordReset);

    const passwordResetExits = await passwordResetRepository.findOne({
      relations: ['user'],
      where: { code },
    });
    if (!passwordResetExits) {
      throw new ServiceError('Invalid Code.', 400);
    }
    if (password !== passwordConfirm) {
      throw new ServiceError('Passwords do not match', 400);
    }
    const { user } = passwordResetExits;

    // #edit-request validate time

    try {
      const hashedPassword = await hash(password, authConfig.crypt.rounds);
      await userRepository.save({
        id: user.id,
        password: hashedPassword,
      });
      await passwordResetRepository.remove(passwordResetExits);
    } catch (err) {
      throw new ServiceError(`error on reset password: ${err}`);
    }
  }
}

export default ResetUserPasswordService;
