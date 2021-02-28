import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';
import Comment from '../../models/Comment';

interface Request {
  text: string;
  userId: string;
  postId: string;
  commentId: string;
}

class UpdateCommentService {
  public async execute({
    userId,
    postId,
    text,
    commentId,
  }: Request): Promise<Comment> {
    const userRepository = getRepository(User);
    const commentsRepository = getRepository(Comment);
    const postsRepository = getRepository(Post);

    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    const postExists = await postsRepository.findOne({
      where: { id: postId },
    });

    const commentExists = await commentsRepository.findOne({
      where: { id: commentId },
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

    const updatedAt = new Date();

    try {
      const comment = await commentsRepository.save({
        ...commentExists,
        updatedAt,
        edited: true,
        text,
      });
      return comment;
    } catch (err) {
      throw new ServiceError(`Erro ao atualizar um comentario: ${err}`);
    }
  }
}

export default UpdateCommentService;
