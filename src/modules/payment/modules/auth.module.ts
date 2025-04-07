import { Module } from "@nestjs/common";
import { PaymentCommandController } from "../controllers/paymentcommand.controller";
import { PaymentLoggingInterceptor } from "../interceptors/payment.logging.interceptor";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { PaymentAuthGuard } from "../guards/paymentauthguard.guard";

@Module({
  controllers: [PaymentCommandController],
  providers: [
    PaymentAuthGuard,
    PaymentLoggingInterceptor,
    CommandBus,
    EventBus,
    UnhandledExceptionBus,
  ],
  exports: [PaymentAuthGuard, CommandBus, EventBus, UnhandledExceptionBus],
})
export class AuthPaymentModule {}
