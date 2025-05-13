import { PickType } from '@nestjs/swagger';
import { Config } from '../entities/config.entity';

export class BaseConfigDto extends PickType(Config, [
  'id',
  'name',
  'config',
  'isActive',
  'createdAt',
  'updatedAt',
]) {}
