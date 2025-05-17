import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DocumentComment } from '../entities/document-comment.entity';

export class BaseCommentDto extends PickType(DocumentComment, [
  'id',
  'documentId',
  'content',
  'image',
  'isEdited',
  'likeCount',
  'dislikeCount',
  'replyCount',
  'parentId',
  'commenterId',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @Expose()
  commenterName?: string;

  @ApiProperty()
  @Expose()
  commenterImage?: string;
}
