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

router.get('/posts/my', async (req, res) => {
  const userRepository = getRepository(User);
  const { username } = req.body;
  const user = await userRepository.findOne({
    where: { username },
    relations: ['posts', 'posts.file', 'posts.tags', 'posts.comments'],
  });
  return res.json({
    posts: user.posts,
  });
});

router.get('/posts/comments', async (req, res) => {
  // essa rota precisa trazer todos os posts que eu comentei.
  const { username } = req.body;
  const fetchCommentedService = new FetchCommentedService();
  try {
    const posts = await fetchCommentedService.execute({
      username,
    });
    return res.status(201).json({
      posts,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.get('/posts/upvotes', async (req, res) => {
  // essa rota precisa trazer todos os posts que eu dei upvote.
  const { username } = req.body;
  const fetchUpvotedService = new FetchUpvotedService();
  try {
    const posts = await fetchUpvotedService.execute({
      username,
    });
    return res.status(201).json({
      posts,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.get('/posts', async (req, res) => {
  // essa rota precisa trazer todos os posts que eu interagi.
  const { username } = req.body;
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
