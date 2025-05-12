import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'timestamptz' })
  @Expose()
  deletedAt: Date;
}
