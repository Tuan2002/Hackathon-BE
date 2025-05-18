import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PointHistory } from '../entities/point-history.entity';

export class PointHistoryDto extends PickType(PointHistory, [
  'id',
  'amount',
  'pointAction',
  'lastPoint',
  'note',
  'historyUserId',
  'createdAt',
]) {
  @ApiProperty()
  @Expose()
  userName?: string;
  @ApiProperty()
  @Expose()
  avatar?: string;
}
