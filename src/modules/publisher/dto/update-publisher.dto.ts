import { PickType } from '@nestjs/swagger';
import { Publisher } from '../entities/publisher.entity';

export class UpdatePublisherDto extends PickType(Publisher, [
  'name',
  'email',
  'address',
  'phone',
]) {}
