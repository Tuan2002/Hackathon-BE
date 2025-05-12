import { Module } from '@nestjs/common';
import { BaseEmailService } from './email.service';

@Module({
  imports: [],
  providers: [BaseEmailService],
  exports: [BaseEmailService],
})
export class EmailModule {}
