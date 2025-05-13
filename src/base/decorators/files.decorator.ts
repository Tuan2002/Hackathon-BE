import { FileType } from '@base/enums/file.enum';
import { StorageFolders } from '@base/enums/storage-folder.enum';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileTypesFilter } from '../..//utils/file-filter.util';
import { multerS3Config } from '../../configs/multer-s3.config';

export function FilesUpload(folder?: StorageFolders, fileTypes?: FileType[]) {
  return UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3Config(folder),
      fileFilter: (req, file, cb) => fileTypesFilter(file, cb, fileTypes),
    }),
  );
}
