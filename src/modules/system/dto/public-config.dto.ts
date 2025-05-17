import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Config } from '../entities/config.entity';
import { PublicSystemConfig } from '../types/system-config.tyoe';

export class PublicConfigDto extends PickType(Config, [
  'id',
  'name',
  'isActive',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ type: () => PublicSystemConfig })
  @Expose()
  config: PublicSystemConfig;
}
