import { getRepository } from 'typeorm';
import { shuffle } from 'lodash';
import ServiceError from '../../util/ServiceError';
import Post from '../../models/Post';

class ShufflePostService {
  public async execute(): Promise<Post> {
    const postRepository = getRepository(Post);
    const posts = await postRepository.find({
      relations: ['file', 'tags', 'comments'],
    });
    const post = shuffle(posts)[0];
    if (!post) throw new ServiceError('Não existe postagens ainda!');
    return post;
  }
}

export default ShufflePostService;
