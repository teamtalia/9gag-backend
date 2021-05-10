/* eslint-disable no-await-in-loop */
import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';

interface Request {
  username: string;
  newUsername: string;
  userId: string;
  sensitive?: boolean;
  showMask?: boolean;
}

class UpdateUserAccountService {
  public async execute({
    username,
    userId,
    newUsername,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const userExits = await userRepository.findOne({
      where: { username },
      relations: ['avatar'],
    });
    if (!userExits) {
      throw new ServiceError('Usuario não existe.', 400);
    }
    const usernameExists = await userRepository.findOne({
      where: { username: newUsername },
    });

    if (usernameExists) {
      throw new ServiceError('Nome de usuario não disponivel.', 400);
    }

    if (userExits.id !== userId) {
      throw new ServiceError(
        'Você não tem permissões para executar esta ação.',
        400,
      );
    }

    const updatedAt = new Date();

    try {
      const user = await userRepository.save({
        ...userExits,
        username: newUsername,
        updatedAt,
      });
      return user;
    } catch (err) {
      throw new ServiceError(`Erro ao atualizar usuário: ${err}`);
    }
  }
}

export default UpdateUserAccountService;
