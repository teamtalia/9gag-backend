import { Router } from 'express';
import bodyParser from 'body-parser';

import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateCommentService from '../services/posts/CreateCommentService';
import UpdateCommentService from '../services/posts/UpdateCommentService';
import ReplyCommentService from '../services/posts/ReplyCommentService';
import RemoveCommentService from '../services/posts/RemoveCommentService';
import CreateCommentMetaService from '../services/posts/CreateCommentMetaService';
import UpdateCommentMetaService from '../services/posts/UpdateCommentMetaService';

import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { order } = req.query;
  // ?order=hot|fresh

  // pega post que quer organizar por hot ou fresh
  const commentsRepository = getRepository(Comment);
  const postRepository = getRepository(Post);
  const post = await postRepository.findOne({ where: { id } });
  // todos os comentários e ordena decrescente
  // trás relações  aninhadas
  let comments = (
    await commentsRepository.find({
      where: { post },
      order: { createdAt: 'DESC' },
      relations: [
        'replies',
        'replies.file',
        'replies.replies',
        'replies.meta',
        'replies.user',
        'replies.user.avatar',
        'reply',
        'meta',
        'file',
        'user',
        'user.avatar',
      ],
    })
  ).map(el => {
    const comment = el;
    comment.user = ({
      id: comment.user.id,
      fullname: comment.user.fullname,
      avatar: comment.user.avatar,
    } as unknown) as User;
    return comment;
  });

  comments = comments.filter(comment => comment.reply === null);
  if (order === 'hot') {
    comments = comments
      .map(comment => {
        const points =
          // criou função pra reduzir o vetor de contagem de pontos
          comment.meta.reduce((old, current) => old + current.vote, 0) +
          comment.replies.reduce(
            (old, current) =>
              old +
              current.meta.reduce(
                (oldOld, currentCurrent) => oldOld + currentCurrent.vote,
                0,
              ),
            0,
          );
        return {
          ...comment,
          points,
        };
      })
      .sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      })
      .map(el => {
        const comment = el;
        delete comment.points;
        return (comment as unknown) as Comment;
      });
  }
  if (comments) {
    return res.json({
      comments,
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
  const { text, fileId } = req.body;
  const { post: postId, id: commentId } = req.params;
  const replyCommentService = new ReplyCommentService();
  try {
    const comment = await replyCommentService.execute({
      text,
      userId,
      postId,
      commentId,
      fileId,
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

router.delete('/:post/comments/:id', ensureAuthenticated, async (req, res) => {
  const { id: userId } = req.token.user;
  const { post: postId, id: commentId } = req.params;
  const removeCommentService = new RemoveCommentService();
  try {
    const comment = await removeCommentService.execute({
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
