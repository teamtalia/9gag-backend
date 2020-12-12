import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
import File from '../../models/File';
import Tag from '../../models/Tag';
import Post from '../../models/Post';

interface Request {
  tags: string[];
  sensitive: boolean;
  originalPoster: string;
  file: string;
  userId: string;
}

class CreatePostService {
  public async execute({
    userId,
    tags,
    sensitive,
    originalPoster,
    file,
  }: Request): Promise<Post> {
    const userRepository = getRepository(User);
    const filesRepository = getRepository(File);
    const tagsRepository = getRepository(Tag);
    const postsRepository = getRepository(Post);

    const userExits = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExits) {
      throw new ServiceError('Invalid User.', 400);
    }

    const fileExits = await filesRepository.findOne({
      where: { id: file },
    });

    if (!fileExits) {
      throw new ServiceError('Invalid File Id.', 400);
    }
    const tagsToInsert = await Promise.all(
      tags.map(async tag => {
        const tagExits = await tagsRepository.findOne({ where: { name: tag } });
        if (!tagExits) {
          throw new ServiceError(`Invalid Tag: ${tag}.`, 400);
        }
        return tagExits;
      }),
    );

    const createdAt = new Date();
    const updatedAt = new Date();

    // falta
    // abrir uma transação:
    // modificar o local do file
    // salvar e depois criar o post

    try {
      const postData = postsRepository.create({
        tags: tagsToInsert,
        createdAt,
        updatedAt,
        originalPoster,
        sensitive,
        user: userExits,
        file: fileExits,
      });
      return await postsRepository.save(postData);
    } catch (err) {
      throw new ServiceError(`error on create post: ${err}`);
    }
  }
}

export default CreatePostService;
