/* eslint-disable no-await-in-loop */
import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import { randomStr } from '../../util/String';
import User from '../../models/User';
import { verifyToken } from '../../config/google';
import UploadExternalFileService from '../files/UploadExternalFileService';

interface Request {
  name?: string;
  email?: string;
  thirdPartyToken?: string;
  picture?: string;
}

class ThirdPartyCreateUserService {
  public async execute({
    name,
    email,
    thirdPartyToken,
    picture,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);
    let userEmail = email;
    let userName = name;
    if (thirdPartyToken) {
      try {
        const payload = await verifyToken(thirdPartyToken);
        userEmail = payload.email;
        userName = payload.name;
      } catch (err) {
        throw new ServiceError(err.message, 500);
      }
    }

    const userExits = await userRepository.findOne({
      where: { email: userEmail },
    });
    if (userExits) {
      throw new ServiceError('E-mail já registrado.', 400);
    }
    const username = randomStr(16);

    do {
      const usernameExists = await userRepository.findOne({
        where: { username },
      });
      if (!usernameExists) break;
    } while (true);

    const createdAt = new Date();
    const updatedAt = new Date();
    const verifiedAt = new Date();

    const userData = userRepository.create({
      fullname: userName,
      email: userEmail,
      createdAt,
      updatedAt,
      verifiedAt,
      username,
    });
    try {
      const user = await userRepository.save(userData);
      if (picture) {
        const uploadService = new UploadExternalFileService();
        const avatar = await uploadService.execute({
          url: picture,
          userId: user.id,
        });
        return await userRepository.save({
          avatar,
          id: user.id,
        });
      }
      return user;
    } catch (err) {
      throw new ServiceError(`Erro ao criar usuário: ${err}`);
    }
  }
}

export default ThirdPartyCreateUserService;
