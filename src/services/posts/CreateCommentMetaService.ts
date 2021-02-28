import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';
import Comment from '../../models/Comment';
import UserComment from '../../models/UserComment';

interface Request {
  vote: number;
  userId: string;
  postId: string;
  commentId: string;
}

class CreateCommentMetaService {
  public async execute({
    userId,
    postId,
    vote,
    commentId,
  }: Request): Promise<UserComment> {
    const userRepository = getRepository(User);
    const commentsRepository = getRepository(Comment);
    const postsRepository = getRepository(Post);
    const commentsPostsRepository = getRepository(UserComment);

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

    const userCommentExits = await commentsPostsRepository.findOne({
      where: { user: userExists, comment: commentExists },
    });

    const updatedAt = new Date();
    const createdAt = new Date();

    try {
      if (userCommentExits) {
        return await commentsPostsRepository.save({
          ...userCommentExits,
          vote,
        });
      }
      const userCommentData = commentsPostsRepository.create({
        createdAt,
        updatedAt,
        vote,
        user: userExists,
        comment: commentExists,
      });
      const userComment = await commentsPostsRepository.save(userCommentData);
      const refinedUserComment = await commentsPostsRepository.findOne({
        where: { id: userComment.id },
      });
      return refinedUserComment;
    } catch (err) {
      throw new ServiceError(`Erro ao interagir com um comentario: ${err}`);
    }
  }
}

export default CreateCommentMetaService;
