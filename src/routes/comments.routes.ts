import { Router } from 'express';
import bodyParser from 'body-parser';

import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateCommentService from '../services/posts/CreateCommentService';
import UpdateCommentService from '../services/posts/UpdateCommentService';
import ReplyCommentService from '../services/posts/ReplyCommentService';
import CreateCommentMetaService from '../services/posts/CreateCommentMetaService';
import UpdateCommentMetaService from '../services/posts/UpdateCommentMetaService';

// import User from '../models/User';
import Post from '../models/Post';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:id/comments', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;

  const postRepository = getRepository(Post);
  const post = await postRepository.findOne({
    where: { id },
    relations: [
      'comments',
      'comments.replies',
      'comments.replies.meta',
      'comments.reply',
      'comments.meta',
      'comments.file',
    ], // eager + nested relations ❤️
  });
  if (post) {
    return res.json({
      comments: post.comments.filter(comment => comment.reply === null),
    });
  }
  return res.status(500).json({
    message: 'id invalido de post',
  });
});

router.post('/:id/comments', ensureAuthenticated, async (req, res) => {
  const { id: userId } = req.token.user;
  const { text, fileId } = req.body;
  const { id: postId } = req.params;
  const createCommentService = new CreateCommentService();
  try {
    const comment = await createCommentService.execute({
      text,
      fileId,
      userId,
      postId,
    });
    return res.status(201).json({
      id: comment.id,
      text: comment.text,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.put('/:post/comments/:id', ensureAuthenticated, async (req, res) => {
  const { id: userId } = req.token.user;
  const { text } = req.body;
  const { post: postId, id: commentId } = req.params;
  const updateCommentService = new UpdateCommentService();
  try {
    const comment = await updateCommentService.execute({
      text,
      userId,
      postId,
      commentId,
    });
    return res.status(200).json({
      ...comment,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.post('/:post/comments/:id', ensureAuthenticated, async (req, res) => {
  const { id: userId } = req.token.user;
  const { text } = req.body;
  const { post: postId, id: commentId } = req.params;
  const replyCommentService = new ReplyCommentService();
  try {
    const comment = await replyCommentService.execute({
      text,
      userId,
      postId,
      commentId,
    });
    return res.status(201).json({
      ...comment,
    });
  } catch (err) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
});

router.post(
  '/:post/comments/:id/meta',
  ensureAuthenticated,
  async (req, res) => {
    const { id: userId } = req.token.user;
    const { vote } = req.body;
    const { post: postId, id: commentId } = req.params;
    const createCommentMetaService = new CreateCommentMetaService();
    try {
      const userComment = await createCommentMetaService.execute({
        vote,
        userId,
        postId,
        commentId,
      });
      return res.status(201).json({
        ...userComment,
      });
    } catch (err) {
      return res.status(err.status).json({
        message: err.message,
      });
    }
  },
);

router.put(
  '/:post/comments/:id/meta',
  ensureAuthenticated,
  async (req, res) => {
    const { id: userId } = req.token.user;
    const { vote } = req.body;
    const { post: postId, id: commentId } = req.params;
    const updateCommentMetaService = new UpdateCommentMetaService();
    try {
      const userComment = await updateCommentMetaService.execute({
        vote,
        userId,
        postId,
        commentId,
      });
      return res.status(201).json({
        ...userComment,
      });
    } catch (err) {
      return res.status(err.status).json({
        message: err.message,
      });
    }
  },
);

export default router;
