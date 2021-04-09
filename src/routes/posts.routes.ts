import { Router } from 'express';
import bodyParser from 'body-parser';
import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreatePostService from '../services/posts/CreatePostService';
import InteractPostService from '../services/posts/InteractPostService';
import ShufflePostService from '../services/posts/ShufflePostService';
import Post from '../models/Post';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  // comentário
  // criar o serviço de buscar posts posteriormente (feed)
  const postRepository = getRepository(Post);
  const posts = await postRepository.find({
    relations: ['file', 'tags', 'comments'],
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
    // passando parametros para função criada service
    const postUser = await createUserPostService.execute({
      postId,
      userId: id,
      vote,
    });
    // filtra informações e retorna só o necessário
    // 201 novo recurso criado
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

router.get('/shuffle', async (req, res) => {
  const shufflePostService = new ShufflePostService();
  try {
    const post = await shufflePostService.execute();
    return res.status(200).json({
      ...post,
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const postRepository = getRepository(Post);
  const post = await postRepository.findOne({
    where: { id },
    relations: ['file', 'tags', 'comments'],
  });
  if (post) return res.json(post);
  return res.status(400).json({
    message: 'ID Inválido.',
  });
});

export default router;
