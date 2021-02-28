import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';
import Comment from '../../models/Comment';

interface Request {
  userId: string;
  postId: string;
  commentId: string;
}

class RemoveCommentService {
  public async execute({
    userId,
    postId,
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
    if (commentExists.user.id !== userExists.id) {
      throw new ServiceError(
        'Você não tem privilégio suficiente para completar esta ação.',
        400,
      );
    }

    try {
      // adicionar a parte do amazon s3
      return await commentsRepository.remove(commentExists);
    } catch (err) {
      throw new ServiceError(`Erro ao interagir com um comentario: ${err}`);
    }
  }
}

export default RemoveCommentService;
