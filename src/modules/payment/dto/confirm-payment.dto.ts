import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  orderCode: number;
  @ApiProperty()
  @Expose()
  @IsString()
  paymentId: string;
}
