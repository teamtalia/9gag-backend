import { getRepository } from 'typeorm';

import ServiceError from '../../util/ServiceError';
import PostFileUploadService from '../files/PostFileUploadService';
import User from '../../models/User';
import File from '../../models/File';
import Tag from '../../models/Tag';
import Post from '../../models/Post';
// import { S3, AwsBucket } from '../../config/s3';

interface Request {
  tags: string[];
  sensitive: boolean;
  originalPoster: string;
  file: string;
  userId: string;
  description?: string;
}

class CreatePostService {
  public async execute({
    userId,
    tags,
    sensitive,
    originalPoster,
    file,
    description,
  }: Request): Promise<Post> {
    const userRepository = getRepository(User);
    const filesRepository = getRepository(File);
    const tagsRepository = getRepository(Tag);
    const postsRepository = getRepository(Post);

    const postFileUploadService = new PostFileUploadService();

    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new ServiceError('Invalid User.', 400);
    }

    const fileExists = await filesRepository.findOne({
      where: { id: file },
    });

    if (!fileExists) {
      throw new ServiceError('Invalid File Id.', 400);
    }
    const tagsToInsert = await Promise.all(
      tags.map(async tag => {
        const tagExists = await tagsRepository.findOne({
          where: { name: tag },
        });
        if (!tagExists) {
          throw new ServiceError(`Invalid Tag: ${tag}.`, 400);
        }
        return tagExists;
      }),
    );

    const createdAt = new Date();
    const updatedAt = new Date();

    // try {
    //   await S3.copyObject({
    //     Bucket: AwsBucket,
    //     CopySource: `${AwsBucket}/${fileExists.key}`, // old file Key
    //     Key: `${fileExists.key.replace('tmp/', '')}`, // new file Key
    //     ACL: 'public-read',
    //   }).promise();

    //   await S3.deleteObject({
    //     Bucket: AwsBucket,
    //     Key: fileExists.key,
    //   }).promise();
    // } catch (err) {
    //   throw new ServiceError(
    //     `error on moving the file in the amazon bucket: ${err}`,
    //   );
    // }
    // try {
    //   filesRepository.save({
    //     id: fileExists.id,
    //     key: fileExists.key.replace('tmp/', ''),
    //     location: fileExists.location.replace('tmp/', ''),
    //   });
    // } catch (err) {
    //   throw new ServiceError(
    //     `error on updating the file key in the database: ${err}`,
    //   );
    // }

    try {
      await postFileUploadService.execute({ file: fileExists });
      const postData = postsRepository.create({
        tags: tagsToInsert,
        createdAt,
        updatedAt,
        originalPoster,
        sensitive,
        user: userExists,
        file: fileExists,
        description,
      });
      const post = await postsRepository.save(postData);
      return await postsRepository.findOne({
        where: { id: post.id },
        relations: ['file', 'tags'],
      });
    } catch (err) {
      throw new ServiceError(`error on create post: ${err}`);
    }
  }
}

export default CreatePostService;
