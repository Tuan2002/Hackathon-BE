import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Document } from '../entities/document.entity';
export class BaseDocumentDto extends PickType(Document, [
  'id',
  'name',
  'slug',
  'image',
  'shortDescription',
  'categoryId',
  'authorId',
  'publisherId',
  'fileKey',
  'fileType',
  'fileName',
  'status',
  'isActive',
  'viewCount',
  'downloadCount',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @Expose()
  categoryName?: string;

  @ApiProperty()
  @Expose()
  authorName?: string;

  @ApiProperty()
  @Expose()
  publisherName?: string;
}
