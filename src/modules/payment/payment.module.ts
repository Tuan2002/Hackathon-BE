import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../document/entities/document.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
@Module({
  imports: [TypeOrmModule.forFeature([Document]), UserModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
