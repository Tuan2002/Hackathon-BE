import { FileType } from '@base/enums/file.enum';
import { BadRequestException } from '@nestjs/common';

export function fileTypesFilter(file, cb, allowedFileTypes?: FileType[]) {
  if (!file) {
    return cb(null, true);
  }
  if (!allowedFileTypes || allowedFileTypes.length === 0) {
    return cb(null, true);
  }
  if (allowedFileTypes.includes(file.mimetype as FileType)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException({
        message: `File type ${file.mimetype} is not allowed. Allowed types are: ${allowedFileTypes.join(', ')}`,
      }),
      false,
    );
  }
}
