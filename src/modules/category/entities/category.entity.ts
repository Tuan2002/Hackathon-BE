import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Document } from '@modules/document/entities/document.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import slug from 'slug';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
@Entity(Table.Category)
@Index(['slug'], { unique: true })
export class Category extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  name: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Expose()
  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    this.slug = slug(this.name) + '-' + new Date().getTime();
  }

  // Relations
  @OneToMany(() => Document, (document) => document.category, {
    nullable: true,
  })
  documents?: Document[];
}
