import multer from 'multer';
import multerS3 from 'multer-s3';
import { uuid } from 'uuidv4';

import { S3, AwsBucket } from '../config/s3';

// const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const s3 = (options: any = {}) =>
  multer({
    storage: multerS3({
      s3: S3,
      bucket: AwsBucket,
      acl: 'public-read',
      key(request: Request, file, cb) {
        cb(null, `tmp/${uuid()}-${file.originalname}`);
      },
      ...options,
    }),
    limits: {
      fileSize: 1024 * 1024 * 25, // max 25mb upload
    },
  });

export default s3;
