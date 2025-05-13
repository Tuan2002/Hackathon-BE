import { PickType } from '@nestjs/swagger';
import { Publisher } from '../entities/publisher.entity';

export class BasePublisherDto extends PickType(Publisher, [
  'id',
  'name',
  'email',
  'address',
  'phone',
  'createdAt',
  'updatedAt',
]) {}
