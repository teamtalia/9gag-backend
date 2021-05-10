/* eslint-disable no-await-in-loop */
import { getRepository, getManager } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import File from '../../models/File';

interface Request {
  fullname: string;
  age?: number;
  about: string;
  fileId?: string;
  username: string;
  userId: string;
}

class UpdateUserProfileService {
  public async execute({
    fullname,
    age,
    about,
    fileId,
    username,
    userId,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const fileRepository = getRepository(File);

    const userExits = await userRepository.findOne({
      where: { username },
      relations: ['avatar'],
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
    // eslint-disable-next-line prefer-destructuring
    let avatar = userExits.avatar;
    if (fileId) {
      avatar = await fileRepository.findOne(fileId);
      if (!avatar) {
        throw new ServiceError('Avatar invalido.', 400);
      }
    }
    const updatedAt = new Date();

    try {
      const user = await userRepository.save({
        ...userExits,
        avatar,
        fullname,
        about,
        age: age || userExits.age,
        updatedAt,
      });
      return user;
    } catch (err) {
      throw new ServiceError(`Erro ao atualizar usuário: ${err}`);
    }
  }
}

export default UpdateUserProfileService;
