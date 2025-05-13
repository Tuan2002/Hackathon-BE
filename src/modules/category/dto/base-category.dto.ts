import { PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class BaseCategoryDto extends PickType(Category, [
  'id',
  'name',
  'slug',
  'description',
  'isDeleted',
  'deletedAt',
  'createdAt',
  'deletedAt',
]) {}
