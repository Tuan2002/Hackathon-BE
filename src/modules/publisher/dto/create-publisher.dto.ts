import { PickType } from '@nestjs/swagger';
import { Publisher } from '../entities/publisher.entity';

export class CreatePublisherDto extends PickType(Publisher, [
  'name',
  'email',
  'address',
  'phone',
]) {}
