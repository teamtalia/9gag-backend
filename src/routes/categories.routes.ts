import { Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../models/Category';
import CreateCategoryService from '../services/posts/CreateCategoryService';

const router = Router();

router.get('/', async (req, res) => {
  // precisa mudar para um serviço
  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find({});
  return res.json({
    categories,
  });
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const createCategoryService = new CreateCategoryService();
  try {
    const category = await createCategoryService.execute({ name });
    return res.status(201).json({
      name,
      slug: category.slug,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
