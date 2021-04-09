import Axios from 'axios';
import { uuid } from 'uuidv4';
import { getRepository, getManager } from 'typeorm';
import { parse } from 'url';
import { lookup } from 'mime-types';
import { extname } from 'path';

import ServiceError from '../../util/ServiceError';
import { createUploadStream } from '../../util/s3';
import File from '../../models/File';
import { S3, AwsBucket } from '../../config/s3';
import User from '../../models/User';

export interface FileProps {
  key: string;
  originalname: string;
  location: string;
  contentType: string;
  size: number;
  mimetype: string;
}
interface Request {
  userId: string;
  url: string;
}

class UploadExternalFileService {
  public async execute({ url, userId }: Request): Promise<File> {
    const fileRepository = getRepository(File);
    const userRepository = getRepository(User);
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new ServiceError('Usuário Inválido.', 400);
    }

    const originalname = parse(url).pathname;
    const mimeType = lookup(originalname) || 'text/plain';

    try {
      const { promise, stream } = createUploadStream(
        `tmp/${uuid()}${extname(originalname)}`,
      );
      const { data } = await Axios({
        method: 'GET',
        url,
        responseType: 'stream',
      });
      data.pipe(stream);
      const { Key, Location } = await promise;
      const { ContentLength, ContentType } = await S3.headObject({
        Key,
        Bucket: AwsBucket,
      }).promise();

      const createdAt = new Date();
      const updatedAt = new Date();
      const fileData = fileRepository.create({
        key: Key,
        originalname,
        location: Location,
        contentType: ContentType,
        size: ContentLength,
        mimetype: mimeType,
        user: userExists,
        createdAt,
        updatedAt,
      });
      return (await getManager().transaction(
        async transactionalEntityManager => {
          try {
            const responseFile = await transactionalEntityManager.save(
              fileData,
            );
            return responseFile;
          } catch (err) {
            transactionalEntityManager.release(); // rollback
            await S3.deleteObject({
              Bucket: AwsBucket,
              Key,
            }).promise();
            throw err;
          }
        },
      )) as File;
    } catch (err) {
      throw new ServiceError(err, 500);
    }
  }
}

export default UploadExternalFileService;
