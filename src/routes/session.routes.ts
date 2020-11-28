import { Router, Request, Response } from 'express';
// import { check, validationResult } from 'express-validator/check';

import AuthenticateUserService from '../services/AuthenticateUserService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { password, email, thirdPartyToken } = req.body;

  const authenticateService = new AuthenticateUserService();
  try {
    const token = await authenticateService.execute({
      email,
      password,
      thirdPartyToken,
    });

    return res.status(201).json({
      token,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
