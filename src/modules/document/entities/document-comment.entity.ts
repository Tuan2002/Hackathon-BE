import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Document } from '@modules/document/entities/document.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity(Table.DocumentComment)
export class DocumentComment extends AbstractEntity {
  @ApiProperty()
  @Expose()
  @Column({ nullable: true })
  parentId?: string;
  @ApiProperty()
  @Expose()
  @Column()
  documentId: string;

  @ApiProperty()
  @Expose()
  @Column()
  commenterId: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ nullable: true })
  @Expose()
  @Column({ nullable: true })
  image?: string;

  @ApiProperty()
  @Expose()
  @Column({ default: false })
  isEdited: boolean;

  @ApiProperty()
  @Expose()
  @Column({ default: 0 })
  likeCount: number;

  @ApiProperty()
  @Expose()
  @Column({ default: 0 })
  dislikeCount: number;

  @ApiProperty()
  @Expose()
  @Column({ default: 0 })
  replyCount: number;

  // Relations
  @ManyToOne(() => User, (user) => user.documentComments, {
    nullable: false,
  })
  @JoinColumn({ name: 'commenter_id' })
  commenter: User;

  @ManyToOne(() => Document, (document) => document.documentComments, {
    nullable: false,
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(
    () => DocumentComment,
    (documentComment) => documentComment.replies,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'parent_id' })
  parent?: DocumentComment;

  @OneToMany(() => DocumentComment, (documentComment) => documentComment.parent)
  replies?: DocumentComment[];
}
