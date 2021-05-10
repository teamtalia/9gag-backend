import { getRepository } from 'typeorm';
import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import { compare } from 'bcrypt';

import TokenPayloadType from '../../contracts/TokenPayloadType';
import { verifyToken } from '../../config/google';
import ServiceError from '../../util/ServiceError';
import authConfig from '../../config/auth';
import User from '../../models/User';

import ThirdPartyAuthenticateUserService from './ThirdPartyAuthenticateUserService';

interface Request {
  email: string;
  password: string;
  thirdPartyToken: string;
}

class AuthenticateUserService {
  public async execute({
    email,
    password,
    thirdPartyToken,
  }: Request): Promise<any> {
    const usersRepository = getRepository(User);
    const authenticateThirdPartyServices = new ThirdPartyAuthenticateUserService();

    if (thirdPartyToken) {
      try {
        const payload = await verifyToken(thirdPartyToken);
        return await authenticateThirdPartyServices.execute(payload);
      } catch (err) {
        throw new ServiceError(err.message, 401);
      }
    }
    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new ServiceError('Incompatibilidade de e-mail ou senha.', 400);
    }

    if (
      user.password === null ||
      typeof user.password === 'undefined' ||
      !user.password
    ) {
      throw new ServiceError(
        'Contas criadas pelo Google não têm permissão para fazer login usando e-mail.',
        400,
      );
    }

    try {
      const result = await promisify(compare)(password, user.password);

      if (result) {
        const payload: TokenPayloadType = {
          user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            username: user.username,
          },
        };
        const token = await promisify<TokenPayloadType, Secret, SignOptions>(
          sign,
        )(payload, authConfig.secret, {
          expiresIn: 36000, // voltar ao tempo normal
        });
        return { token, payload };
      }
      throw new ServiceError('Incompatibilidade de e-mail ou senha.', 400);
    } catch (err) {
      throw new ServiceError(err, 500);
    }
  }
}

export default AuthenticateUserService;
