import { AbstractEntity } from '@base/entities/base.entity';
import { SecurityOptions, Table } from '@constants';
import { Genders } from '@modules/user/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { UserRoles } from '../enums/roles.enum';

@Index(['email'], { unique: true })
@Entity(Table.User)
export class User extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ unique: true })
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Column({ select: false })
  hashedPassword: string;

  @ApiProperty()
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
  @IsNotEmpty()
  @Column({ enum: UserRoles })
  role: UserRoles;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.firstName !== null)
  @IsString()
  @Column({ nullable: true })
  firstName?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.lastName !== null)
  @IsString()
  @Column({ nullable: true })
  lastName?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.address !== null)
  @IsString()
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.phone !== null)
  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.dob !== null)
  @IsDate()
  @Column({ nullable: true })
  dob?: string;

  @ApiProperty({ nullable: true, enum: Genders, enumName: 'Gender' })
  @ValidateIf((o) => o.gender !== null)
  @IsEnum(Genders)
  @Column({ nullable: true, enum: Genders })
  gender?: Genders;

  @ApiProperty({ nullable: true })
  @ValidateIf((o) => o.avatar !== null)
  @IsUrl()
  @Column({
    nullable: true,
  })
  avatar?: string;

  @BeforeUpdate()
  lockoutUser() {
    if (this.loginFailedTimes >= SecurityOptions.LOGIN_LOCKOUT_LIMIT) {
      this.isLocked = true;
    }
  }
}
