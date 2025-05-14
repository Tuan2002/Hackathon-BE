import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Document } from '@modules/document/entities/document.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(Table.FavoriteDocument)
export class FavoriteDocument extends AbstractEntity {
  @ApiProperty()
  @Expose()
  @Column()
  documentId: string;

  @ApiProperty()
  @Expose()
  @Column()
  userId: string;

  // Relations
  @ManyToOne(() => User, (user) => user.favoriteDocuments, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  favoriteUser: User;

  @ManyToOne(() => Document, (document) => document.favoriteDocuments, {
    nullable: false,
  })
  @JoinColumn({ name: 'document_id' })
  favoriteDocument: Document;
}
