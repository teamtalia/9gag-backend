import { Router, Request, Response } from 'express';
// import { check, validationResult } from 'express-validator/check';

import AuthenticateUserService from '../services/auth/AuthenticateUserService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { password, email, thirdPartyToken } = req.body;

  const authenticateService = new AuthenticateUserService();
  try {
    const { token, payload } = await authenticateService.execute({
      email,
      password,
      thirdPartyToken,
    });
    return res.status(200).json({
      token,
      ...payload,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
