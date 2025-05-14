import { ApiProperty, PickType } from '@nestjs/swagger';
import { Document } from '../entities/document.entity';
export class PublicDocumentDto extends PickType(Document, [
  'id',
  'image',
  'name',
  'slug',
  'description',
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
  categoryName?: string;

  @ApiProperty()
  authorName?: string;

  @ApiProperty()
  publisherName?: string;
}
