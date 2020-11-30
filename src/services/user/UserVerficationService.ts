import { getRepository } from 'typeorm';

import User from '../../models/User';
import ServiceError from '../../util/ServiceError';

interface Props {
  code: string;
}

class UserVerficationService {
  public async execute({ code }: Props): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { verificationCode: code },
    });
    if (!user) {
      throw new ServiceError('mismatch code', 400);
    }
    try {
      const verifyUser = await userRepository.save({
        id: user.id,
        verifiedAt: new Date(),
        verificationCode: null,
      });
      return verifyUser;
    } catch (err) {
      throw new ServiceError(err, 500);
    }
  }
}

export default UserVerficationService;
