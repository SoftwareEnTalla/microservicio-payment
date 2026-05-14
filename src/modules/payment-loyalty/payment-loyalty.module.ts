import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentCustomerGatewayEligibility } from '../payment-customer-gateway-eligibility/entities/payment-customer-gateway-eligibility.entity';
import { PaymentMerchantGatewayEligibility } from '../payment-merchant-gateway-eligibility/entities/payment-merchant-gateway-eligibility.entity';
import { PaymentCustomerWallet } from './payment-customer-wallet.entity';
import { PaymentWalletMovement } from './payment-wallet-movement.entity';
import { PaymentPayoutRequest } from './payment-payout-request.entity';
import { PaymentLoyaltyController } from './payment-loyalty.controller';
import { PaymentLoyaltyService } from './payment-loyalty.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      PaymentCustomerGatewayEligibility,
      PaymentCustomerWallet,
      PaymentWalletMovement,
      PaymentPayoutRequest,
      PaymentMerchantGatewayEligibility,
    ]),
  ],
  controllers: [PaymentLoyaltyController],
  providers: [PaymentLoyaltyService],
  exports: [PaymentLoyaltyService],
})
export class PaymentLoyaltyModule {}