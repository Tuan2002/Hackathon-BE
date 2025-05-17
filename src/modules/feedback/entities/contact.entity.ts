import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity(Table.Contact)
export class Contact extends AbstractEntity {
  @ApiProperty()
  @IsString()
  @Expose()
  @Column()
  name: string;

  @ApiProperty()
  @IsEmail()
  @Expose()
  @Column()
  email: string;

  @ApiProperty({ nullable: true })
  @Expose()
  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  @Column({ nullable: true })
  message?: string;

  @ApiProperty()
  @Expose()
  @Column({ default: false })
  isReplied: boolean;
}
