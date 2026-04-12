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
import { PaymentCustomerGatewayEligibilityCommandController } from "../controllers/paymentcustomergatewayeligibilitycommand.controller";
import { PaymentCustomerGatewayEligibilityQueryController } from "../controllers/paymentcustomergatewayeligibilityquery.controller";
import { PaymentCustomerGatewayEligibilityCommandService } from "../services/paymentcustomergatewayeligibilitycommand.service";
import { PaymentCustomerGatewayEligibilityQueryService } from "../services/paymentcustomergatewayeligibilityquery.service";
import { PaymentCustomerGatewayEligibilityCommandRepository } from "../repositories/paymentcustomergatewayeligibilitycommand.repository";
import { PaymentCustomerGatewayEligibilityQueryRepository } from "../repositories/paymentcustomergatewayeligibilityquery.repository";
import { PaymentCustomerGatewayEligibilityRepository } from "../repositories/paymentcustomergatewayeligibility.repository";
import { PaymentCustomerGatewayEligibilityResolver } from "../graphql/paymentcustomergatewayeligibility.resolver";
import { PaymentCustomerGatewayEligibilityAuthGuard } from "../guards/paymentcustomergatewayeligibilityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentCustomerGatewayEligibility } from "../entities/payment-customer-gateway-eligibility.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentCustomerGatewayEligibilityHandler } from "../commands/handlers/createpaymentcustomergatewayeligibility.handler";
import { UpdatePaymentCustomerGatewayEligibilityHandler } from "../commands/handlers/updatepaymentcustomergatewayeligibility.handler";
import { DeletePaymentCustomerGatewayEligibilityHandler } from "../commands/handlers/deletepaymentcustomergatewayeligibility.handler";
import { GetPaymentCustomerGatewayEligibilityByIdHandler } from "../queries/handlers/getpaymentcustomergatewayeligibilitybyid.handler";
import { GetPaymentCustomerGatewayEligibilityByFieldHandler } from "../queries/handlers/getpaymentcustomergatewayeligibilitybyfield.handler";
import { GetAllPaymentCustomerGatewayEligibilityHandler } from "../queries/handlers/getallpaymentcustomergatewayeligibility.handler";
import { PaymentCustomerGatewayEligibilityCrudSaga } from "../sagas/paymentcustomergatewayeligibility-crud.saga";
import { PaymentCustomerGatewayEligibilityStartedSyncSaga } from "../sagas/payment-customer-gateway-eligibility-started-sync.saga";
import { PaymentCustomerGatewayEligibilityApprovedSyncSaga } from "../sagas/payment-customer-gateway-eligibility-approved-sync.saga";
import { PaymentCustomerGatewayEligibilityRejectedSyncSaga } from "../sagas/payment-customer-gateway-eligibility-rejected-sync.saga";
import { PaymentCustomerGatewayEligibilityExpiredSyncSaga } from "../sagas/payment-customer-gateway-eligibility-expired-sync.saga";import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentCustomerGatewayEligibilityInterceptor } from "../interceptors/paymentcustomergatewayeligibility.interceptor";
import { PaymentCustomerGatewayEligibilityLoggingInterceptor } from "../interceptors/paymentcustomergatewayeligibility.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentCustomerGatewayEligibility]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentCustomerGatewayEligibilityCommandController, PaymentCustomerGatewayEligibilityQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentCustomerGatewayEligibilityQueryService,
    PaymentCustomerGatewayEligibilityCommandService,
    //Repositories
    PaymentCustomerGatewayEligibilityCommandRepository,
    PaymentCustomerGatewayEligibilityQueryRepository,
    PaymentCustomerGatewayEligibilityRepository,      
    //Resolvers
    PaymentCustomerGatewayEligibilityResolver,
    //Guards
    PaymentCustomerGatewayEligibilityAuthGuard,
    //Interceptors
    PaymentCustomerGatewayEligibilityInterceptor,
    PaymentCustomerGatewayEligibilityLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentCustomerGatewayEligibilityHandler,
    UpdatePaymentCustomerGatewayEligibilityHandler,
    DeletePaymentCustomerGatewayEligibilityHandler,
    GetPaymentCustomerGatewayEligibilityByIdHandler,
    GetPaymentCustomerGatewayEligibilityByFieldHandler,
    GetAllPaymentCustomerGatewayEligibilityHandler,
    PaymentCustomerGatewayEligibilityCrudSaga,
    PaymentCustomerGatewayEligibilityStartedSyncSaga,
    PaymentCustomerGatewayEligibilityApprovedSyncSaga,
    PaymentCustomerGatewayEligibilityRejectedSyncSaga,
    PaymentCustomerGatewayEligibilityExpiredSyncSaga,    //Configurations
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
    PaymentCustomerGatewayEligibilityQueryService,
    PaymentCustomerGatewayEligibilityCommandService,
    //Repositories
    PaymentCustomerGatewayEligibilityCommandRepository,
    PaymentCustomerGatewayEligibilityQueryRepository,
    PaymentCustomerGatewayEligibilityRepository,      
    //Resolvers
    PaymentCustomerGatewayEligibilityResolver,
    //Guards
    PaymentCustomerGatewayEligibilityAuthGuard,
    //Interceptors
    PaymentCustomerGatewayEligibilityInterceptor,
    PaymentCustomerGatewayEligibilityLoggingInterceptor,
  ],
})
export class PaymentCustomerGatewayEligibilityModule {}

