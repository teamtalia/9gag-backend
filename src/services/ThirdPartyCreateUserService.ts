/* eslint-disable no-await-in-loop */
import { getRepository, getManager, Repository } from 'typeorm';
import SendUserEmailVerification from './SendUserEmailVerification';
import ServiceError from '../util/ServiceError';
import User from '../models/User';
import { verifyToken } from '../config/google';

interface Request {
  name?: string;
  email?: string;
  thirdPartyToken?: string;
}

class ThirdPartyCreateUserService {
  public async execute({
    name,
    email,
    thirdPartyToken,
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
      throw new ServiceError('Email already registered.', 400);
    }

    const createdAt = new Date();
    const updatedAt = new Date();
    const verifiedAt = new Date();

    const userData = userRepository.create({
      fullname: userName,
      email: userEmail,
      createdAt,
      updatedAt,
      verifiedAt,
    });
    try {
      return await userRepository.save(userData);
    } catch (err) {
      throw new ServiceError(`error on created user: ${err}`);
    }
  }
}

export default ThirdPartyCreateUserService;
