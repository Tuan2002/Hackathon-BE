import { AuthorizedContext } from '@modules/auth/types';
import { TransactionStatus } from '@modules/user/enums/transaction-status.enum';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import PayOS from '@payos/node';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private payOSService: PayOS;

  constructor(private readonly userService: UserService) {
    this.payOSService = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  async checkoutPaymentAsync(context: AuthorizedContext, amount: number) {
    const orderCode = new Date().getTime();
    const order: CreatePaymentDto = {
      orderCode: orderCode,
      description: `Nạp tiền vào tài khoản`,
      orderItems: [
        {
          name: 'Mua đểm dịch vụ tài liệu SenseLib',
          quantity: 1,
          price: amount,
        },
      ],
      cancelUrl: `${process.env.FRONTEND_URL}/deposit/success`,
      returnUrl: `${process.env.FRONTEND_URL}/deposit/error`,
      amount: amount,
    };

    const paymentLinkData = await this.payOSService.createPaymentLink(order);
    const paymentUrl = paymentLinkData.checkoutUrl;
    const paymentId = paymentLinkData.paymentLinkId;

    await this.userService.createTransactionAsync(
      context.userId,
      paymentId,
      amount,
    );

    return {
      paymentUrl,
      orderCode,
      paymentId,
    };
  }

  async createPaymentAsync(createPaymentDto: CreatePaymentDto) {
    const { orderCode, orderItems, description, cancelUrl, returnUrl, amount } =
      createPaymentDto;
    const paymentLinkData = await this.payOSService.createPaymentLink({
      orderCode: orderCode,
      items: orderItems,
      description: description,
      cancelUrl: cancelUrl,
      returnUrl: returnUrl,
      amount: amount,
    });
    return paymentLinkData;
  }

  async verifyPaymentAsync(confirmPaymentDto: ConfirmPaymentDto) {
    const { paymentId } = confirmPaymentDto;
    const paymentData =
      await this.payOSService.getPaymentLinkInformation(paymentId);

    if (paymentData.status === TransactionStatus.SUCCESS) {
      const amountPaid = paymentData.amountPaid;
      await this.userService.confirmTransactionAsync(
        paymentData.id,
        amountPaid,
      );

      return {
        status: TransactionStatus.SUCCESS,
        message: 'Nạp tiền thành công',
      };
    }

    await this.userService.cancelTransactionAsync(
      paymentData.id,
      paymentData.cancellationReason,
    );

    return {
      status: TransactionStatus.FAILED,
      message: 'Nạp tiền thất bại',
    };
  }
}
