import { Module } from "@nestjs/common";
import { PaymentCommandController } from "../controllers/paymentcommand.controller";
import { PaymentQueryController } from "../controllers/paymentquery.controller";
import { PaymentCommandService } from "../services/paymentcommand.service";
import { PaymentQueryService } from "../services/paymentquery.service";
import { PaymentCommandRepository } from "../repositories/paymentcommand.repository";
import { PaymentQueryRepository } from "../repositories/paymentquery.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { PaymentResolver } from "../graphql/payment.resolver";
import { PaymentAuthGuard } from "../guards/paymentauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "../entities/payment.entity";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { CacheModule } from "@nestjs/cache-manager";

//Interceptors
import { PaymentInterceptor } from "../interceptors/payment.interceptor";
import { PaymentLoggingInterceptor } from "../interceptors/payment.logging.interceptor";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), // Asegúrate de incluir esto
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentQueryController, PaymentCommandController],
  providers: [
    PaymentQueryService,
    PaymentCommandService,
    PaymentCommandRepository,
    PaymentQueryRepository,
    PaymentRepository,
    PaymentResolver,
    PaymentAuthGuard,
    PaymentInterceptor,
    PaymentLoggingInterceptor,
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    PaymentQueryService,
    PaymentCommandService,
    PaymentCommandRepository,
    PaymentQueryRepository,
    PaymentRepository,
    PaymentResolver,
    PaymentAuthGuard,
    PaymentInterceptor,
    PaymentLoggingInterceptor,
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class PaymentModule {}
