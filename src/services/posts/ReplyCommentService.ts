import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';
import Comment from '../../models/Comment';
import File from '../../models/File';

interface Request {
  text: string;
  userId: string;
  postId: string;
  fileId: string;
  commentId: string;
}

const MAX_LEVEL_REPLIES = 1;

class ReplyCommentService {
  public async execute({
    userId,
    postId,
    text,
    commentId,
    fileId,
  }: Request): Promise<Comment> {
    const userRepository = getRepository(User);
    const commentsRepository = getRepository(Comment);
    const postsRepository = getRepository(Post);
    const filesRepository = getRepository(File);

    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    const postExists = await postsRepository.findOne({
      where: { id: postId },
    });

    const fileExists = await filesRepository.findOne({
      where: { id: fileId },
    });

    const commentExists = await commentsRepository.findOne({
      where: { id: commentId },
      relations: ['replies'],
    });

    if (!userExists) {
      throw new ServiceError('Usuário inválido.', 400);
    }
    if (!postExists) {
      throw new ServiceError('Postagem inválida.', 400);
    }
    if (!postExists) {
      throw new ServiceError('Comentário inválida.', 400);
    }

    if (!fileExists) {
      throw new ServiceError('Arquivo inválido.', 400);
    }
    if (commentExists.level + 1 > MAX_LEVEL_REPLIES) {
      throw new ServiceError('O nivel máximo de resposta foi atingido.', 400);
    }

    const updatedAt = new Date();
    const createdAt = new Date();

    try {
      const commentData = commentsRepository.create({
        createdAt,
        updatedAt,
        text,
        user: userExists,
        post: postExists,
        reply: commentExists,
        level: commentExists.level + 1,
        file: fileExists,
      });
      const comment = await commentsRepository.save(commentData);
      const commentRefined = await commentsRepository.findOne({
        where: { id: comment.id },
      });
      return commentRefined;
    } catch (err) {
      throw new ServiceError(`Erro ao responder um comentario: ${err}`);
    }
  }
}

export default ReplyCommentService;
