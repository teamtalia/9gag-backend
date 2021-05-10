/* eslint-disable no-await-in-loop */
import { getRepository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { promisify } from 'util';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import auth from '../../config/auth';

interface Request {
  oldPassword: string;
  password: string;
  username: string;
  userId: string;
}

class UpdateUserPasswordService {
  public async execute({
    oldPassword,
    password,
    username,
    userId,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const userExits = await userRepository.findOne({
      where: { username },
    });
    if (!userExits) {
      throw new ServiceError('Usuario não existe.', 400);
    }
    if (userExits.id !== userId) {
      throw new ServiceError(
        'Você não tem permissões para executar esta ação.',
        400,
      );
    }

    const hashedPassword = await hash(password, auth.crypt.rounds);

    const result = await promisify(compare)(oldPassword, userExits.password);
    if (!result) throw new ServiceError(`Erro ao mudar de senha`, 400);

    try {
      const updatedAt = new Date();

      const user = await userRepository.save({
        ...userExits,
        updatedAt,
        password: hashedPassword,
        passwordResets: [], // zera a lista de password resets
      });
      return user;
    } catch (err) {
      throw new ServiceError(`Erro ao atualizar usuário: ${err}`);
    }
  }
}

export default UpdateUserPasswordService;
