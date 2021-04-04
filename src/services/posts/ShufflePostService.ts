import { getRepository } from 'typeorm';
import { shuffle } from 'lodash';
import ServiceError from '../../util/ServiceError';
import Post from '../../models/Post';

class ShufflePostService {
  public async execute(): Promise<Post> {
    const postRepository = getRepository(Post);
    try {
      const posts = await postRepository.find({
        relations: ['file', 'tags', 'comments'],
      });
      return shuffle(posts)[0];
    } catch (err) {
      throw new ServiceError('Erro ao buscar uma postagem aleatória: ', err);
    }
  }
}

export default ShufflePostService;
