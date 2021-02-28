import { getRepository } from 'typeorm';

import PostFileUploadService from '../files/PostFileUploadService';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';
import Comment from '../../models/Comment';
import File from '../../models/File';

interface Request {
  text: string;
  userId: string;
  postId: string;
  fileId?: string;
}

class CreateCommentService {
  public async execute({
    userId,
    postId,
    text,
    fileId,
  }: Request): Promise<Comment> {
    const userRepository = getRepository(User);
    const commentsRepository = getRepository(Comment);
    const postsRepository = getRepository(Post);
    const filesRepository = getRepository(File);

    const postFileUploadService = new PostFileUploadService();

    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    const postExists = await postsRepository.findOne({
      where: { id: postId },
    });

    if (!userExists) {
      throw new ServiceError('Usuário inválido.', 400);
    }
    if (!postExists) {
      throw new ServiceError('Postagem inválida.', 400);
    }
    let file;
    if (fileId) {
      file = await filesRepository.findOne({
        where: { id: fileId },
      });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      if (file) {
        await postFileUploadService.execute({ file });
      }
      const commentData = commentsRepository.create({
        createdAt,
        updatedAt,
        text,
        user: userExists,
        post: postExists,
        file,
      });
      const comment = await commentsRepository.save(commentData);
      return comment;
    } catch (err) {
      throw new ServiceError(`Erro ao criar um comentario: ${err}`);
    }
  }
}

export default CreateCommentService;
