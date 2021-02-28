/* eslint-disable no-restricted-syntax */
import { getRepository } from 'typeorm';
import { spawn } from 'child_process';
import ServiceError from '../../util/ServiceError';
import User from '../../models/User';
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
  userId: string;
  file: FileProps;
}

class CreateFileService {
  public async execute({ userId, file }: Request): Promise<File> {
    const userRepository = getRepository(User);
    const filesRepository = getRepository(File);

    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new ServiceError('Invalid User.', 400);
    }
    const child = spawn('mediainfo', [file.location]);

    for await (const data of child.stdout) {
      const payload = Buffer.from(data).toString('utf-8');
      console.log(payload.split('\n').length);
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const fileData = filesRepository.create({
        ...file,
        createdAt,
        updatedAt,
        user: userExists,
      });
      return await filesRepository.save(fileData);
    } catch (err) {
      // script usando sdk da amazon pra deletar o arquivo caso tenha algum erro
      // na hora de inserir no banco de dados
      const data = await S3.deleteObject({
        Bucket: AwsBucket,
        Key: file.key,
      }).promise();
      if (data.$response.error) {
        throw new ServiceError(
          `erro ao remover arquivo do bucket: ${data.$response.error.message}`,
        );
      }
      throw new ServiceError(`error on upload file: ${err}`);
    }
  }
}

export default CreateFileService;
