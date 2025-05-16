import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Document } from '../entities/document.entity';
export class PublicDocumentDto extends PickType(Document, [
  'id',
  'image',
  'name',
  'slug',
  'description',
  'shortDescription',
  'rejectedReason',
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
