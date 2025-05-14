import { AbstractEntity } from '@base/entities/base.entity';
import { FileType } from '@base/enums/file.enum';
import { Table } from '@constants';
import { Author } from '@modules/author/entities/author.entity';
import { Category } from '@modules/category/entities/category.entity';
import { Publisher } from '@modules/publisher/entities/publisher.entity';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import * as slug from 'slug';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentComment } from './document-comment.entity';
import { DownloadDocument } from './download-document.entity';
import { FavoriteDocument } from './favorite-document.entity';
@Entity(Table.Document)
@Index(['slug'], { unique: true })
export class Document extends AbstractEntity {
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
  @ValidateIf((o) => o.image !== undefined)
  @IsNotEmpty()
  @IsUrl()
  @Expose()
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ enum: DocumentStatus, enumName: 'DocumentStatus' })
  @IsEnum(DocumentStatus)
  @Expose()
  @Column({ default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @ApiProperty()
  @Expose()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @IsUUID()
  @Expose()
  @Column()
  ownerId: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.authorId !== undefined)
  @IsUUID()
  @Expose()
  @Column({ nullable: true })
  authorId?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.authorId !== undefined)
  @IsUUID()
  @Expose()
  @Column({ nullable: true })
  publisherId?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.categoryId !== undefined)
  @IsUUID()
  @Expose()
  @Column({ nullable: true })
  categoryId?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  @Column({ nullable: true })
  shortDescription?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Expose()
  @Column({ default: 0 })
  viewCount: number;

  @ApiProperty()
  @Expose()
  @Column({ default: 0 })
  downloadCount: number;

  @ApiProperty()
  @ValidateIf((o) => o.fileKey !== undefined)
  @Expose()
  @IsString()
  @Column({ nullable: true })
  fileKey?: string;

  @ApiProperty()
  @ValidateIf((o) => o.fileName !== undefined)
  @Expose()
  @IsString()
  @Column({ nullable: true })
  fileName?: string;

  @ApiProperty({ enum: FileType, enumName: 'FileType' })
  @ValidateIf((o) => o.fileType !== undefined)
  @Expose()
  @IsString()
  @IsEnum(FileType)
  @IsIn([
    FileType.PDF,
    FileType.WORD_DOC,
    FileType.WORD_DOCX,
    FileType.EXCEL_XLS,
    FileType.EXCEL_XLSX,
    FileType.POWERPOINT_PPT,
    FileType.POWERPOINT_PPTX,
    FileType.TEXT,
  ])
  @Column({ nullable: true })
  fileType?: FileType;

  // Relations
  // Category
  @ManyToOne(() => Category, (category) => category.documents, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // Owner
  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Author
  @ManyToOne(() => Author, (author) => author.documents)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  // Publisher
  @ManyToOne(() => Publisher, (publisher) => publisher.documents)
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  // Download Documents
  @OneToMany(
    () => DownloadDocument,
    (downloadDocument) => downloadDocument.document,
  )
  downloadDocuments: DownloadDocument[];

  // Favorite Documents
  @OneToMany(
    () => FavoriteDocument,
    (favoriteDocument) => favoriteDocument.favoriteDocument,
  )
  favoriteDocuments: FavoriteDocument[];

  // Document Comments
  @OneToMany(
    () => DocumentComment,
    (documentComment) => documentComment.document,
  )
  documentComments: DocumentComment[];

  // Subscriber events
  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    this.slug = slug(this.name) + '-' + new Date().getTime();
  }
}
