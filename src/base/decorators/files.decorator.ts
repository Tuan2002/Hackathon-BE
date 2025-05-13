import { FileType } from '@base/enums/file.enum';
import { FileTypeGuard } from '@base/guards/file-type.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiForbiddenResponse,
    ApiNotAcceptableResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const FILES_KEY = 'FILES';
export const Files = (...fileTypes: FileType[]) =>
  SetMetadata(FILES_KEY, fileTypes);

export function FileTypes(...fileTypes: FileType[]) {
  return applyDecorators(
    Files(...fileTypes),
    UseGuards(FileTypeGuard),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiUnauthorizedResponse({ description: '401 - Unauthorized' }),
    ApiForbiddenResponse({ description: '403 - Forbidden' }),
    ApiNotAcceptableResponse({
      description: '406 - Not Acceptable',
    }),
  );
}
