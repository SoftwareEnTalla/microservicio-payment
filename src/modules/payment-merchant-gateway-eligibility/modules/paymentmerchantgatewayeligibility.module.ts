/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Module } from "@nestjs/common";
import { PaymentMerchantGatewayEligibilityCommandController } from "../controllers/paymentmerchantgatewayeligibilitycommand.controller";
import { PaymentMerchantGatewayEligibilityQueryController } from "../controllers/paymentmerchantgatewayeligibilityquery.controller";
import { PaymentMerchantGatewayEligibilityCommandService } from "../services/paymentmerchantgatewayeligibilitycommand.service";
import { PaymentMerchantGatewayEligibilityQueryService } from "../services/paymentmerchantgatewayeligibilityquery.service";
import { PaymentMerchantGatewayEligibilityCommandRepository } from "../repositories/paymentmerchantgatewayeligibilitycommand.repository";
import { PaymentMerchantGatewayEligibilityQueryRepository } from "../repositories/paymentmerchantgatewayeligibilityquery.repository";
import { PaymentMerchantGatewayEligibilityRepository } from "../repositories/paymentmerchantgatewayeligibility.repository";
import { PaymentMerchantGatewayEligibilityResolver } from "../graphql/paymentmerchantgatewayeligibility.resolver";
import { PaymentMerchantGatewayEligibilityAuthGuard } from "../guards/paymentmerchantgatewayeligibilityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentMerchantGatewayEligibility } from "../entities/payment-merchant-gateway-eligibility.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentMerchantGatewayEligibilityHandler } from "../commands/handlers/createpaymentmerchantgatewayeligibility.handler";
import { UpdatePaymentMerchantGatewayEligibilityHandler } from "../commands/handlers/updatepaymentmerchantgatewayeligibility.handler";
import { DeletePaymentMerchantGatewayEligibilityHandler } from "../commands/handlers/deletepaymentmerchantgatewayeligibility.handler";
import { GetPaymentMerchantGatewayEligibilityByIdHandler } from "../queries/handlers/getpaymentmerchantgatewayeligibilitybyid.handler";
import { GetPaymentMerchantGatewayEligibilityByFieldHandler } from "../queries/handlers/getpaymentmerchantgatewayeligibilitybyfield.handler";
import { GetAllPaymentMerchantGatewayEligibilityHandler } from "../queries/handlers/getallpaymentmerchantgatewayeligibility.handler";
import { PaymentMerchantGatewayEligibilityCrudSaga } from "../sagas/paymentmerchantgatewayeligibility-crud.saga";
import { PaymentMerchantGatewayEligibilityActivatedSyncSaga } from "../sagas/payment-merchant-gateway-eligibility-activated-sync.saga";
import { PaymentMerchantGatewayEligibilityUpdatedSyncSaga } from "../sagas/payment-merchant-gateway-eligibility-updated-sync.saga";
import { PaymentMerchantGatewayEligibilityDeactivatedSyncSaga } from "../sagas/payment-merchant-gateway-eligibility-deactivated-sync.saga";import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentMerchantGatewayEligibilityInterceptor } from "../interceptors/paymentmerchantgatewayeligibility.interceptor";
import { PaymentMerchantGatewayEligibilityLoggingInterceptor } from "../interceptors/paymentmerchantgatewayeligibility.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentMerchantGatewayEligibility]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentMerchantGatewayEligibilityCommandController, PaymentMerchantGatewayEligibilityQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentMerchantGatewayEligibilityQueryService,
    PaymentMerchantGatewayEligibilityCommandService,
    //Repositories
    PaymentMerchantGatewayEligibilityCommandRepository,
    PaymentMerchantGatewayEligibilityQueryRepository,
    PaymentMerchantGatewayEligibilityRepository,      
    //Resolvers
    PaymentMerchantGatewayEligibilityResolver,
    //Guards
    PaymentMerchantGatewayEligibilityAuthGuard,
    //Interceptors
    PaymentMerchantGatewayEligibilityInterceptor,
    PaymentMerchantGatewayEligibilityLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentMerchantGatewayEligibilityHandler,
    UpdatePaymentMerchantGatewayEligibilityHandler,
    DeletePaymentMerchantGatewayEligibilityHandler,
    GetPaymentMerchantGatewayEligibilityByIdHandler,
    GetPaymentMerchantGatewayEligibilityByFieldHandler,
    GetAllPaymentMerchantGatewayEligibilityHandler,
    PaymentMerchantGatewayEligibilityCrudSaga,
    PaymentMerchantGatewayEligibilityActivatedSyncSaga,
    PaymentMerchantGatewayEligibilityUpdatedSyncSaga,
    PaymentMerchantGatewayEligibilityDeactivatedSyncSaga,    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    PaymentMerchantGatewayEligibilityQueryService,
    PaymentMerchantGatewayEligibilityCommandService,
    //Repositories
    PaymentMerchantGatewayEligibilityCommandRepository,
    PaymentMerchantGatewayEligibilityQueryRepository,
    PaymentMerchantGatewayEligibilityRepository,      
    //Resolvers
    PaymentMerchantGatewayEligibilityResolver,
    //Guards
    PaymentMerchantGatewayEligibilityAuthGuard,
    //Interceptors
    PaymentMerchantGatewayEligibilityInterceptor,
    PaymentMerchantGatewayEligibilityLoggingInterceptor,
  ],
})
export class PaymentMerchantGatewayEligibilityModule {}

