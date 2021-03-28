import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';

interface Request {
  username: string;
}

class FetchCommentedService {
  public async execute({ username }: Request): Promise<Post[]> {
    const userRepository = getRepository(User);
    const userExists = await userRepository.findOne({
      where: { username },
      relations: [
        'comments',
        'comments.reply',
        'comments.post',
        'comments.post.file',
        'comments.post.tags',
      ],
    });
    if (!userExists) {
      throw new ServiceError('Usuário inexistente.', 400);
    }
    const posts = userExists.comments
      .map(comment => comment.post)
      .filter((post, index, self) => {
        const findPost = self.findIndex(el => el.id === post.id);
        return findPost && findPost === index;
      })
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });

    return posts;
  }
}

export default FetchCommentedService;
