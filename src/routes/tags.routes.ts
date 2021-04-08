import { Router } from 'express';
import { getRepository } from 'typeorm';
import CreateTagService from '../services/posts/CreateTagService';

import ensureAuthenticated from '../middleware/ensureAuthenticated';
import Tag from '../models/Tag';

const router = Router();

router.get('/', async (req, res) => {
  // precisa mudar para um serviço
  const tagsRepository = getRepository(Tag);
  const tags = await tagsRepository.find({ relations: ['icon', 'category'] });
  return res.json({
    tags,
  });
});

router.post('/', ensureAuthenticated, async (req, res) => {
  const { name, icon, categoryId } = req.body;
  const createTagService = new CreateTagService();
  try {
    const tag = await createTagService.execute({ name, icon, categoryId });
    return res.status(201).json({
      name,
      slug: tag.slug,
      icon: tag.icon ? tag.icon.location : null,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
