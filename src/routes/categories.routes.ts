import { Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../models/Category';

const router = Router();

router.get('/', async (req, res) => {
  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find({});
  return res.json({
    categories,
  });
});
