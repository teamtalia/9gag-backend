import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';

import Post from '../../models/Post';

class FetchPostFreshService {
  public async execute(): Promise<Post[]> {
    const postsRepository = getRepository(Post);

    try {
      const posts = (
        await postsRepository.find({
          relations: [
            'file',
            'tags',
            'comments',
            'votes',
            'votes.user',
            'user',
          ],
          order: { createdAt: 'DESC' },
        })
      )
        .map(post => {
          const points = post.votes.reduce(
            (old, current) => old + current.voted,
            0,
          );
          return {
            ...post,
            points,
          };
        })
        .map(el => {
          const post = el;
          delete post.points;
          delete post.user.password;
          delete post.user.verificationCode;
          delete post.user.votePosts;
          post.votes = post.votes.map(_vote => {
            const vote = _vote;
            delete vote.user.password;
            delete vote.user.verificationCode;
            delete vote.user.votePosts;
            return vote;
          });
          return (post as unknown) as Post;
        });
      return posts;
    } catch (err) {
      throw new ServiceError(`Erro ao buscar posts em alta: ${err}`);
    }
  }
}

export default FetchPostFreshService;
