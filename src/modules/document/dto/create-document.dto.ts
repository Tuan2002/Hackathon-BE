import { PickType } from '@nestjs/swagger';
import { Document } from '../entities/document.entity';
export class CreateDocumentDto extends PickType(Document, [
  'name',
  'description',
  'shortDescription',
  'categoryId',
  'authorId',
  'publisherId',
  'fileKey',
  'fileType',
  'fileName',
]) {}
