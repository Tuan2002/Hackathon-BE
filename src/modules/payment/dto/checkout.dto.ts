import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CheckoutDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  amount: number;
}

export class CheckoutResponseDto {
  @ApiProperty()
  @Expose()
  paymentUrl: string;

  @ApiProperty()
  @Expose()
  orderCode: string;

  @ApiProperty()
  @Expose()
  paymentId: string;
}
