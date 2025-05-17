import { PickType } from '@nestjs/swagger';
import { Banner } from '../entities/banner.entity';

export class BaseBannerDto extends PickType(Banner, [
  'id',
  'title',
  'image',
  'link',
  'description',
  'isActive',
  'createdAt',
  'updatedAt',
]) {}
