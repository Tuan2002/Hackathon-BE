import { S3Client } from '@aws-sdk/client-s3';
import { StoragePermission } from '@base/enums/storage-permission.enum';
import { StorageEngine } from 'multer';
import multerS3 from 'multer-s3';
import slug from 'slug';

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
  },
  region: process.env.DO_SPACE_REGION,
});

export const multerS3Config = (
  folderName?: string,
  permission: StoragePermission = StoragePermission.PUBLIC,
): StorageEngine =>
  multerS3({
    s3: s3Client,
    bucket: process.env.DO_SPACE_BUCKET_NAME,
    acl: permission ?? StoragePermission.PUBLIC,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const [fileName, fileExtension] = file.originalname.split('.');
      const fileKey = folderName
        ? `${folderName}/${Date.now()}-${slug(fileName)}.${fileExtension}`
        : `${Date.now()}-${slug(fileName)}.${fileExtension}`;
      cb(null, fileKey);
    },
  });
