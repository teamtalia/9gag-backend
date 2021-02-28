import { Router } from 'express';
import bodyParser from 'body-parser';

import { getRepository } from 'typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreatePostService from '../services/posts/CreatePostService';
import InteractPostService from '../services/posts/InteractPostService';
// import User from '../models/User';
import Post from '../models/Post';
import User from '../models/User';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  // comentário
  // criar o serviço de buscar posts posteriormente (feed)
  // precisa tambem filtrar a respostas pra não retornar informações sensiveis
  // const userRepository = getRepository(User);
  const postRepository = getRepository(Post);
  // const user = await userRepository.findOne({
  //   where: { id },
  //   relations: ['posts', 'posts.file', 'posts.tags'], // eager relations + nested relations ❤️
  // });
  const posts = await postRepository.find({
    relations: ['file', 'tags'],
  });
  return res.json({
    posts,
  });
});

router.post('/vote', ensureAuthenticated, async (req, res) => {
  const { id } = req.token.user;
  const { postId, vote } = req.body;
  const createUserPostService = new InteractPostService();
  try {
    const postUser = await createUserPostService.execute({
      postId,
      userId: id,
      vote,
    });
    return res.status(201).json({
      id: postUser.id,
      post: postUser.post.id,
      voted: vote,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.post('/', ensureAuthenticated, async (req, res) => {
  const { id } = req.token.user;
  const { tags, sensitive, originalPoster, file, description } = req.body;
  // a parte de upvote/downvote e etc e criado em outdescriptionro contexto...
  const createPostService = new CreatePostService();
  try {
    const post = await createPostService.execute({
      file,
      originalPoster,
      userId: id,
      sensitive,
      tags,
      description,
    });
    return res.status(201).json({
      id: post.id,
      file: post.file.location,
      sensitive,
      tags: post.tags,
      originalPoster,
      description,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

export default router;
