import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentCustomerWallet } from './payment-customer-wallet.entity';
import { PaymentWalletMovement } from './payment-wallet-movement.entity';
import { PaymentLoyaltyController } from './payment-loyalty.controller';
import { PaymentLoyaltyService } from './payment-loyalty.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentCustomerWallet, PaymentWalletMovement])],
  controllers: [PaymentLoyaltyController],
  providers: [PaymentLoyaltyService],
  exports: [PaymentLoyaltyService],
})
export class PaymentLoyaltyModule {}