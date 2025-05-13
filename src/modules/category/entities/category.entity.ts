import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';

@Entity(Table.Category)
export class Category extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Index({ unique: true })
  @Column()
  slug: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Expose()
  @Column({ default: false })
  isDeleted: boolean;
}
