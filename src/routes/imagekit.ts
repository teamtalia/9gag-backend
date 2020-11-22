import { Router } from 'express';
import imagekit from '../service/imagekit';

const router = Router();

router.get('/', (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  return res.json({ ...authenticationParameters });
});

export default router;
