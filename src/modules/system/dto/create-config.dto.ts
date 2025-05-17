import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Config } from '../entities/config.entity';
import { SystemConfig } from '../types/system-config.tyoe';

export class CreateConfigDto extends PickType(Config, ['name']) {
  @IsNotEmpty()
  @ApiProperty({ type: () => SystemConfig })
  config: SystemConfig;
}
