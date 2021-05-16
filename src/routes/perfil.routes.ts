import { Router } from 'express';
import { getRepository } from 'typeorm';
// import { trim } from '../util/Object';
import User from '../models/User';
// import ensureAuthenticated from '../middleware/ensureAuthenticated';
import FetchCommentedService from '../services/perfil/FetchCommentedService';
import FetchUpvotedService from '../services/perfil/FetchUpvotedService';
import FetchHomeService from '../services/perfil/FetchHomeService';

const router = Router();

// faltar ordenar

router.get('/:username/posts/my', async (req, res) => {
  const userRepository = getRepository(User);
  const { username } = req.params;
  const user = await userRepository.findOne({
    where: { username },
    relations: [
      'posts',
      'posts.file',
      'posts.tags',
      'posts.comments',
      'posts.votes',
      'posts.votes.user',
    ],
  });
  return res.json({
    posts: user.posts.map(el => ({ ...el, reason: 'Enviado' })),
  });
});

router.get('/:username/posts/comments', async (req, res) => {
  // essa rota precisa trazer todos os posts que eu comentei.
  const { username } = req.params;
  const fetchCommentedService = new FetchCommentedService();
  try {
    const posts = await fetchCommentedService.execute({
      username,
    });
    return res.status(201).json({
      posts: posts.map(post => ({ ...post, reason: 'Comentado' })),
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.get('/:username/posts/upvotes', async (req, res) => {
  // essa rota precisa trazer todos os posts que eu dei upvote.
  const { username } = req.params;
  const fetchUpvotedService = new FetchUpvotedService();
  try {
    const posts = await fetchUpvotedService.execute({
      username,
    });
    return res.status(201).json({
      posts: posts.map(post => ({ ...post, reason: 'Curtido' })),
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.get('/:username/posts', async (req, res) => {
  // essa rota precisa trazer todos os posts que eu interagi.
  const { username } = req.params;
  const fetchHomeService = new FetchHomeService();
  try {
    const posts = await fetchHomeService.execute({
      username,
    });
    return res.status(201).json({
      posts: posts.map(post => ({ ...post.post, reason: post.reason })),
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
