import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';

import Post from '../../models/Post';

class FetchPostHotService {
  public async execute(): Promise<Post[]> {
    const postsRepository = getRepository(Post);

    try {
      const posts = (
        await postsRepository.find({
          relations: ['file', 'tags', 'comments', 'votes'],
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
        .sort((a, b) => {
          if (a.points > b.points) {
            return -1;
          }
          if (a.points < b.points) {
            return 1;
          }
          return 0;
        });
      return posts;
    } catch (err) {
      throw new ServiceError(`Erro ao buscar posts em alta: ${err}`);
    }
  }
}

export default FetchPostHotService;
