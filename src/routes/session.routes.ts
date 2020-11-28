import { Router, Request, Response } from 'express';
// import { check, validationResult } from 'express-validator/check';

import AuthenticateUserService from '../services/AuthenticateUserService';

const router = Router();

router.post(
  '/',
  // [
  //   check('email', 'Por favor entre um e-mail válido.').isEmail(),
  //   check('password', 'Por favor digite uma senha válida.').isLength({
  //     min: 6,
  //   }),
  // ],
  async (req: Request, res: Response) => {
    // #modification-request:add yulp
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     errors: errors.array(),
    //   });
    // }
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
  },
);

export default router;
