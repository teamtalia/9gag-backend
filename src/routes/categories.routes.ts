import { Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../models/Category';

const router = Router();

router.get('/', async (req, res) => {
  // precisa mudar para um serviço
  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find({});
  return res.json({
    categories,
  });
});

export default router;
