import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';

import User from '../../models/User';
import Post from '../../models/Post';
import UserPost from '../../models/UserPost';
// import Comment from '../../models/Comments';

// DTO explica o método
interface Request {
  postId: string;
  userId: string;
  vote: number;
}

// typeorm usa o cara que vai fazer as operações sobre a tabela que são os repositórios
class InteractPostService {
  public async execute({ postId, userId, vote }: Request): Promise<UserPost> {
    const userRepository = getRepository(User);
    const postsRepository = getRepository(Post);
    const userPostRepository = getRepository(UserPost);
    // const commentRepository = getRepository(Comment);

    const post = await postsRepository.findOne(postId);
    const user = await userRepository.findOne(userId);

    if (post && user) {
      const userPost = await userPostRepository.findOne({
        where: { postId, userId },
      });

      // se não existe tem que criar
      // verificar se é o tipo certo

      if (userPost) {
        const userPostResult = await userPostRepository.save({
          ...userPost,
          voted: vote,
        });
        return userPostResult;
      }
      try {
        const createdAt = new Date();
        const updatedAt = new Date();
        const userPostData = userPostRepository.create({
          user,
          post,
          voted: vote,
          createdAt,
          updatedAt,
        });
        const userPost2 = await userPostRepository.save(userPostData);
        return userPost2;
      } catch (err) {
        throw new ServiceError(`error on create tag: ${err}`);
      }
    } else {
      throw new ServiceError(`post or user is invalid`);
    }
  }
}

export default InteractPostService;
