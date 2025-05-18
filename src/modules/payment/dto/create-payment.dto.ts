import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreatePaymentDto {
  @ApiProperty()
  @Expose()
  orderCode: number;
  @ApiProperty({ type: [OrderItemDto] })
  @Expose()
  orderItems: OrderItemDto[];
  @ApiProperty()
  @Expose()
  description: string;
  @ApiProperty()
  @Expose()
  cancelUrl: string;
  @ApiProperty()
  @Expose()
  returnUrl: string;
  @ApiProperty()
  @Expose()
  amount: number;
}
