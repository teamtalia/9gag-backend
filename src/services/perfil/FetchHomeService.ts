import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';

import FetchCommentedService from './FetchCommentedService';
import FetchUpvotedService from './FetchUpvotedService';

interface Request {
  username: string;
}

interface PostWithReason {
  reason: string;
  post: Post;
}

class FetchHomeService {
  public async execute({ username }: Request): Promise<PostWithReason[]> {
    const userRepository = getRepository(User);
    const fetchUpvotedService = new FetchUpvotedService();
    const fetchCommentedService = new FetchCommentedService();
    try {
      const user = await userRepository.findOne({
        where: { username },
        relations: [
          'posts',
          'posts.file',
          'posts.tags',
          'posts.comments',
          'posts.votes',
          'posts.votes.user',
        ],
      });
      const postHadUploaded = user.posts.map(
        post => (({ post, reason: 'Enviado' } as unknown) as PostWithReason),
      );

      const postsHadCommented = (
        await fetchCommentedService.execute({
          username,
        })
      ).map(
        post =>
          (({
            reason: 'Comentado',
            post,
          } as unknown) as PostWithReason),
      );
      const postsHadVoted = (
        await fetchUpvotedService.execute({
          username,
        })
      ).map(
        post =>
          (({
            post,
            reason: 'Curtido',
          } as unknown) as PostWithReason),
      );
      const joinPost = [
        ...postHadUploaded,
        ...postsHadCommented,
        ...postsHadVoted,
      ];

      const posts = joinPost
        .filter((post, index, self) => {
          const findPost = self.findIndex(el => el.post.id === post.post.id);
          return findPost === index;
        })
        .sort((a, b) => {
          if (a.post.createdAt > b.post.createdAt) {
            return -1;
          }
          if (a.post.createdAt < b.post.createdAt) {
            return 1;
          }
          return 0;
        });
      return posts;
    } catch (err) {
      if (err.message) throw new ServiceError(err.message, err.status);
      throw new ServiceError(
        'Erro ao buscar postagens da pagina inicial: ',
        err,
      );
    }
  }
}

export default FetchHomeService;
