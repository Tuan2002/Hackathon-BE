import { AbstractEntity } from '@base/entities/base.entity';
import { SecurityOptions, Table } from '@constants';
import { DocumentComment } from '@modules/document/entities/document-comment.entity';
import { Document } from '@modules/document/entities/document.entity';
import { DownloadDocument } from '@modules/document/entities/download-document.entity';
import { FavoriteDocument } from '@modules/document/entities/favorite-document.entity';
import { Feedback } from '@modules/feedback/entities/feedback.entity';
import { Genders } from '@modules/user/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { BeforeUpdate, Column, Entity, Index, OneToMany } from 'typeorm';
import { UserRoles } from '../enums/roles.enum';
import { PointHistory } from './point-history.entity';
import { Transaction } from './transaction.entity';
@Index(['email'], { unique: true })
@Entity(Table.User)
export class User extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsString()
  @Column({ unique: true })
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Column({ select: false })
  hashedPassword: string;

  @ApiProperty()
  @Expose()
  @Column({ default: false })
  // Automatically set to true when the user login fails 10 times
  isLocked: boolean;

  @ApiProperty()
  @Column({ default: true })
  isFirstLogin: boolean;

  @ApiProperty()
  @Column({ default: 0 })
  loginFailedTimes: number;

  @ApiProperty({ enum: UserRoles, enumName: 'UserRoles' })
  @IsEnum(UserRoles)
  @Expose()
  @IsNotEmpty()
  @Column({ enum: UserRoles })
  role: UserRoles;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.firstName !== null)
  @IsString()
  @Expose()
  @Column({ nullable: true })
  firstName?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.lastName !== null)
  @IsString()
  @Expose()
  @Column({ nullable: true })
  lastName?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.address !== null)
  @IsString()
  @Expose()
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.phone !== null)
  @IsString()
  @Expose()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.dob !== null)
  @IsDate()
  @Expose()
  @Column({ nullable: true })
  dob?: Date;

  @ApiProperty({ nullable: true, enum: Genders, enumName: 'Gender' })
  @ValidateIf((o) => o.gender !== null)
  @IsEnum(Genders)
  @Expose()
  @Column({ nullable: true, enum: Genders })
  gender?: Genders;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.avatar !== null)
  @IsUrl()
  @Expose()
  @Column({
    nullable: true,
  })
  avatar?: string;

  @ApiProperty({ nullable: true })
  @IsNumber()
  @Expose()
  @Column({ default: 100 })
  point: number;

  // Relations
  @OneToMany(() => Transaction, (transaction) => transaction.paymentUser)
  transactions: Transaction[];

  @OneToMany(() => PointHistory, (pointHistory) => pointHistory.historyUser)
  pointHistories: PointHistory[];

  // Documents
  @OneToMany(() => Document, (document) => document.owner)
  documents: Document[];

  @OneToMany(
    () => DownloadDocument,
    (downloadDocument) => downloadDocument.downloadUser,
  )
  downloadDocuments: DownloadDocument[];

  @OneToMany(
    () => FavoriteDocument,
    (favoriteDocument) => favoriteDocument.favoriteUser,
  )
  favoriteDocuments: FavoriteDocument[];

  @OneToMany(
    () => DocumentComment,
    (documentComment) => documentComment.commenter,
  )
  documentComments: DocumentComment[];

  @OneToMany(() => Feedback, (feedback) => feedback.reviewer)
  feedbacks: Feedback[];

  @BeforeUpdate()
  lockoutUser() {
    if (this.loginFailedTimes >= SecurityOptions.LOGIN_LOCKOUT_LIMIT) {
      this.isLocked = true;
    }
  }
}
