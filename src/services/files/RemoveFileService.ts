import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import File from '../../models/File';

interface Request {
  fileId: string;
  userId: string;
}

class RemoveFileService {
  public async execute({ fileId, userId }: Request): Promise<File> {
    const userRepository = getRepository(User);
    const filesRepository = getRepository(File);

    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    const fileExits = await filesRepository.findOne({
      where: { id: fileId },
      relations: ['user'],
    });

    if (!userExists) {
      throw new ServiceError('Usuário inválido.', 400);
    }
    if (!fileExits) {
      throw new ServiceError('Arquivo inválido.', 400);
    }
    if (fileExits.user.id !== userExists.id) {
      throw new ServiceError(
        'Você não tem privilégio suficiente para completar esta ação.',
        400,
      );
    }

    try {
      // adicionar a parte do amazon s3
      return await filesRepository.remove(fileExits);
    } catch (err) {
      throw new ServiceError(`Erro ao remover arquivo: ${err}`);
    }
  }
}

export default RemoveFileService;
