import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import { uuid } from 'uuidv4';

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const S3 = new aws.S3({
  accessKeyId: process.env.S3_KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY,
});

const AwsBucket = 'taliaapp.co';

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
  });

export default s3;
