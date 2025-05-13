import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const s3Instance = new AWS.S3({
  endpoint: process.env.DO_SPACE_ENDPOINT,
  accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
  secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
  region: process.env.DO_SPACE_REGION,
});

export const multerS3Config = multerS3({
  s3: s3Instance,
  bucket: process.env.DO_SPACE_BUCKET_NAME,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
