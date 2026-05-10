import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentAccountingSummaryController } from './payment-accounting-summary.controller';
import { PaymentAccountingSummaryService } from './payment-accounting-summary.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentAccountingSummaryController],
  providers: [PaymentAccountingSummaryService],
  exports: [PaymentAccountingSummaryService],
})
export class PaymentAccountingSummaryModule {}