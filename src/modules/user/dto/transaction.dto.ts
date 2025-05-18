import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Transaction } from '../entities/transaction.entity';

export class TransactionDto extends PickType(Transaction, [
  'id',
  'amount',
  'createdAt',
  'updatedAt',
  'status',
  'failedReason',
  'transactionHash',
  'paymentUserId',
]) {
  @ApiProperty()
  @Expose()
  userName: string;
  @ApiProperty()
  @Expose()
  avatar: string;
}
