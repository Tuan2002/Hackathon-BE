import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { SystemConfig } from '../types/system-config.tyoe';

@Entity(Table.Config)
export class Config extends AbstractEntity {
  @ApiProperty()
  @Expose()
  @IsString()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Expose()
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({ type: () => SystemConfig })
  @Expose()
  @Column({ type: 'json' })
  config: SystemConfig;
}
