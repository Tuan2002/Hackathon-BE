import { PickType } from '@nestjs/swagger';
import { Author } from '../entities/author.entity';

export class BaseAuthorDto extends PickType(Author, [
  'id',
  'name',
  'email',
  'address',
  'phone',
  'createdAt',
  'updatedAt',
]) {}
