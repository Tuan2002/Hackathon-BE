import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionStatus } from '../enums/transaction-status.enum';
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

  @ApiProperty({
    enum: TransactionStatus,
    enumName: 'TransactionStatus',
  })
  @IsEnum(TransactionStatus)
  @Expose()
  @Column({
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

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
