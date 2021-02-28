/* eslint-disable no-restricted-syntax */
import { getRepository } from 'typeorm';
import ServiceError from '../../util/ServiceError';
import File from '../../models/File';
import { S3, AwsBucket } from '../../config/s3';

export interface FileProps {
  key: string;
  originalname: string;
  location: string;
  contentType: string;
  size: number;
  mimetype: string;
}
interface Request {
  file: File;
}

class PostFileUploadService {
  public async execute({ file }: Request): Promise<File> {
    const filesRepository = getRepository(File);
    try {
      await S3.copyObject({
        Bucket: AwsBucket,
        CopySource: `${AwsBucket}/${file.key}`, // old file Key
        Key: `${file.key.replace('tmp/', '')}`, // new file Key
        ACL: 'public-read',
      }).promise();

      await S3.deleteObject({
        Bucket: AwsBucket,
        Key: file.key,
      }).promise();
    } catch (err) {
      throw new ServiceError(
        `error on moving the file in the amazon bucket: ${err}`,
      );
    }
    try {
      return filesRepository.save({
        id: file.id,
        key: file.key.replace('tmp/', ''),
        location: file.location.replace('tmp/', ''),
      });
    } catch (err) {
      throw new ServiceError(
        `error on updating the file key in the database: ${err}`,
      );
    }
  }
}

export default PostFileUploadService;
