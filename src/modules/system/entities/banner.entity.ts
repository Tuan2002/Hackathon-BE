import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity(Table.Banner)
export class Banner extends AbstractEntity {
  @ApiProperty({ nullable: false })
  @Expose()
  @IsString()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Column({ nullable: true })
  image?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @Column({ nullable: true })
  link?: string;

  @ApiProperty()
  @Expose()
  @Column({ default: true })
  isActive: boolean;
}
