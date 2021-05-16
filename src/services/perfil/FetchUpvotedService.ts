import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import Post from '../../models/Post';

interface Request {
  username: string;
}

class FetchUpvotedService {
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
        'metaComments.comment.post.votes',
        'metaComments.comment.post.votes.user',
        'metaComments.comment.post.comments',
        'votePosts',
        'votePosts.post',
        'votePosts.post.tags',
        'votePosts.post.file',
        'votePosts.post.votes',
        'votePosts.post.votes.user',
        'votePosts.post.comments',
      ],
    });

    if (!userExists) {
      throw new ServiceError('Usuário inexistente.', 400);
    }
    const postsHadUpvotedComment = userExists.metaComments
      .filter(iteraction => iteraction.vote !== -1) // somente votos positivos
      .map(comment => comment.comment.post); // pega os posts
    const postsHadUpvoted: Post[] = userExists.votePosts
      .filter(interaction => interaction.voted !== -1)
      .map(userpost => userpost.post); // adicionar a logica da rita do upvote e dowvote [ok]

    const posts = [...postsHadUpvoted, ...postsHadUpvotedComment]
      .filter((post, index, self) => {
        const findPost = self.findIndex(el => el.id === post.id);
        return findPost !== -1 && findPost === index;
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

export default FetchUpvotedService;
