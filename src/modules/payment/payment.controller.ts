import { Auth } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { AuthorizedContext } from '@modules/auth/types';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckoutDto, CheckoutResponseDto } from './dto/checkout.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Auth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout-payment')
  @ApiResponseType(CheckoutResponseDto)
  @ApiOperation({ summary: 'Nạp tiền vào tài khoản' })
  async checkoutPayment(
    @Body() checkoutDto: CheckoutDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return await this.paymentService.checkoutPaymentAsync(
      context,
      checkoutDto.amount,
    );
  }

  @Post('confirm-payment')
  @ApiOperation({ summary: 'Xác nhận thanh toán' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return await this.paymentService.verifyPaymentAsync(confirmPaymentDto);
  }
}
