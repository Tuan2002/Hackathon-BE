import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Document } from '@modules/document/entities/document.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity(Table.Publisher)
export class Publisher extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  @Column()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  address: string;

  @OneToMany(() => Document, (document) => document.publisher, {
    nullable: true,
  })
  documents?: Document[];
}
