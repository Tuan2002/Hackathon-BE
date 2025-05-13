import { S3Client } from '@aws-sdk/client-s3';
import { StorageEngine } from 'multer';
import * as multerS3 from 'multer-s3';

const s3Instance = new S3Client({
  endpoint: process.env.DO_SPACE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
  },
  region: process.env.DO_SPACE_REGION,
});

export const multerS3Config = (folderName?: string): StorageEngine =>
  multerS3({
    s3: s3Instance,
    bucket: process.env.DO_SPACE_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileKey = folderName
        ? `${folderName}/${Date.now()}-${file.originalname}`
        : `${Date.now()}-${file.originalname}`;
      cb(null, fileKey);
    },
  });
