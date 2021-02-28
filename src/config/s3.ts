import aws from 'aws-sdk';

export const S3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const AwsBucket =
  process.env.NODE_ENV === 'production' ? 'taliaapp.co' : 'test.taliaapp.co';
