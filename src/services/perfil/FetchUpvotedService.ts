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
        'metaComments',
        'metaComments.comment',
        'metaComments.comment.post',
        'metaComments.comment.post.tags',
        'metaComments.comment.post.file',
      ],
    });
    if (!userExists) {
      throw new ServiceError('Usuário inexistente.', 400);
    }
    const postsHadUpvotedComment = userExists.metaComments
      .filter(iteraction => iteraction.vote) // somente votos positivos
      .map(comment => comment.comment.post); // pega os posts
    const postsHadUpvoted: Post[] = []; // adicionar a logica da rita do upvote e dowvote

    const posts = [...postsHadUpvoted, ...postsHadUpvotedComment]
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
      }); // cria listagem unica

    return posts;
  }
}

export default FetchCommentedService;
