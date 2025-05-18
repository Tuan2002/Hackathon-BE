import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity(Table.Transaction)
export class Transaction extends AbstractEntity {
  @ApiProperty()
  @IsString()
  @Expose()
  @Column()
  transactionHash: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  @Column()
  amount: number;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  @Column({ default: false })
  isSuccess: boolean;

  @ApiProperty()
  @ValidateIf((o) => o.isSuccess === false && o.failedReason !== undefined)
  @IsString()
  @Expose()
  @Column({ nullable: true })
  failedReason?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  @Column()
  paymentUserId: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'payment_user_id' })
  paymentUser: User;
}
