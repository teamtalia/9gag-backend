import { PassThrough } from 'stream';
import { ManagedUpload } from 'aws-sdk/clients/s3';

import { AwsBucket, S3 } from '../config/s3';

interface UploadStreamProps {
  stream: PassThrough;
  promise: Promise<ManagedUpload.SendData>;
}

export const createUploadStream = (
  key: string,
  options = {},
): UploadStreamProps => {
  const pass = new PassThrough();
  const params = {
    Bucket: AwsBucket,
    Key: key,
    Body: pass,
    ACL: 'public-read',
    ...options,
  };
  return {
    stream: pass,
    promise: S3.upload(params).promise(),
  };
};
