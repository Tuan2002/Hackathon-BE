import { PickType } from '@nestjs/swagger';
import { Author } from '../entities/author.entity';

export class UpdateAuthorDto extends PickType(Author, [
  'name',
  'email',
  'address',
  'phone',
]) {}
