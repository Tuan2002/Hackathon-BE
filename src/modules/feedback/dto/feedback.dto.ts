import { ApiProperty, PickType } from '@nestjs/swagger';
import { Feedback } from '../entities/feedback.entity';

export class FeedbackDto extends PickType(Feedback, [
  'id',
  'star',
  'content',
  'reviewerId',
  'isActive',
  'createdAt',
]) {
  @ApiProperty()
  reviewerName: string;
  @ApiProperty()
  reviewerAvatar: string;
}
