// file-type.guard.ts
import { FILES_KEY } from '@base/decorators/files.decorator';
import { FileType } from '@base/enums/file.enum';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FileTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedFiles = this.reflector.get<FileType[]>(
      FILES_KEY,
      context.getHandler(),
    );

    if (!allowedFiles) {
      return true; // No specific file type check, allow the upload
    }

    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new ForbiddenException('No file uploaded');
    }

    // Validate the file type against allowed files
    const isValidFileType = allowedFiles.includes(file.mimetype as FileType);

    if (!isValidFileType) {
      throw new ForbiddenException('Your file type is not allowed');
    }

    return true;
  }
}
