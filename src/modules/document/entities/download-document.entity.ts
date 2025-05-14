import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Document } from './document.entity';

@Entity(Table.DownloadDocument)
export class DownloadDocument extends AbstractEntity {
  @ApiProperty()
  @Expose()
  @Column()
  documentId: string;

  @ApiProperty()
  @Expose()
  @Column()
  downloadUserId: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  @Expose()
  downloadedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.downloadDocuments, {
    nullable: false,
  })
  @JoinColumn({ name: 'download_user_id' })
  downloadUser: User;

  @ManyToOne(() => Document, (document) => document.downloadDocuments, {
    nullable: false,
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
