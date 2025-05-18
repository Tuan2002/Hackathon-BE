import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Document } from '../entities/document.entity';
export class BaseDocumentDto extends PickType(Document, [
  'id',
  'name',
  'slug',
  'image',
  'point',
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
  categorySlug?: string;

  @ApiProperty()
  @Expose()
  authorName?: string;

  @ApiProperty()
  @Expose()
  publisherName?: string;

  @ApiProperty()
  @Expose()
  isFavorite?: boolean;

  @ApiProperty()
  @Expose()
  favoriteCount?: number;
}
