import { Router } from 'express';
import { getRepository } from 'typeorm';

import { trim } from '../util/Object';
import User from '../models/User';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UserVerficationService from '../services/UserVerficationService';
import ThirdPartyCreateUserService from '../services/ThirdPartyCreateUserService';

const router = Router();

router.route('/').get(ensureAuthenticated, async (req, res) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    return res.status(201).json(
      users.map(user =>
        trim({
          ...user,
          password: undefined, // #remove sensitive info
        }),
      ),
    );
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
});

router.post('/', async (req, res) => {
  const { password, email, fullname, thirdPartyToken } = req.body;
  try {
    let user;
    if (!thirdPartyToken) {
      const createUserService = new CreateUserService();
      user = await createUserService.execute({
        fullname,
        email,
        password,
      });
    } else {
      const createThirdPartyUserService = new ThirdPartyCreateUserService();

      user = await createThirdPartyUserService.execute({
        thirdPartyToken,
      });
    }

    return res.status(201).json(
      trim({
        ...user,
        password: undefined, // #remove sensitive info
        verificationCode: undefined,
      }),
    );
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.get('/verification/:code', async (req, res) => {
  const { code } = req.params;
  const verificationService = new UserVerficationService();
  try {
    const user = await verificationService.execute({
      code,
    });
    return res.status(201).json(
      trim({
        ...user,
        password: undefined, // #remove sensitive info
      }),
    );
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
