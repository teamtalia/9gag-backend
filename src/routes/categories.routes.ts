import { Router } from 'express';
import { getManager, getRepository } from 'typeorm';
import Category from '../models/Category';
import Post from '../models/Post';
import CreateCategoryService from '../services/posts/CreateCategoryService';
import FetchCategoryService from '../services/posts/FetchCategoryService';

const router = Router();

router.get('/', async (req, res) => {
  // precisa mudar para um serviço
  const fetchCategoryService = new FetchCategoryService();
  try {
    const categories = await fetchCategoryService.execute();
    return res.status(201).json({
      categories,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.get('/:categoryId/posts', async (req, res) => {
  const { categoryId } = req.params;

  const categoriesRepository = getRepository(Category);

  const category = await categoriesRepository.findOne({
    where: { id: categoryId },
    relations: ['tags', 'tags.posts', 'tags.posts.file', 'tags.posts.comments'],
  });

  if (!category) {
    return res.status(400).json({ message: 'Id da categoria inválido.' });
  }

  const posts = category.tags
    .map(tag => tag.posts)
    .flat()
    .filter((post, index, self) => {
      const findPost = self.findIndex(el => el.id === post.id);
      return findPost === index;
    });

  return res.json({
    posts,
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
