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
import { PaymentGatewayCommandController } from "../controllers/paymentgatewaycommand.controller";
import { PaymentGatewayQueryController } from "../controllers/paymentgatewayquery.controller";
import { PaymentGatewayCommandService } from "../services/paymentgatewaycommand.service";
import { PaymentGatewayQueryService } from "../services/paymentgatewayquery.service";
import { PaymentGatewayCommandRepository } from "../repositories/paymentgatewaycommand.repository";
import { PaymentGatewayQueryRepository } from "../repositories/paymentgatewayquery.repository";
import { PaymentGatewayRepository } from "../repositories/paymentgateway.repository";
import { PaymentGatewayResolver } from "../graphql/paymentgateway.resolver";
import { PaymentGatewayAuthGuard } from "../guards/paymentgatewayauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentGateway } from "../entities/payment-gateway.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentGatewayHandler } from "../commands/handlers/createpaymentgateway.handler";
import { UpdatePaymentGatewayHandler } from "../commands/handlers/updatepaymentgateway.handler";
import { DeletePaymentGatewayHandler } from "../commands/handlers/deletepaymentgateway.handler";
import { GetPaymentGatewayByIdHandler } from "../queries/handlers/getpaymentgatewaybyid.handler";
import { GetPaymentGatewayByFieldHandler } from "../queries/handlers/getpaymentgatewaybyfield.handler";
import { GetAllPaymentGatewayHandler } from "../queries/handlers/getallpaymentgateway.handler";
import { PaymentGatewayCrudSaga } from "../sagas/paymentgateway-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentGatewayInterceptor } from "../interceptors/paymentgateway.interceptor";
import { PaymentGatewayLoggingInterceptor } from "../interceptors/paymentgateway.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentGateway]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentGatewayCommandController, PaymentGatewayQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentGatewayQueryService,
    PaymentGatewayCommandService,
    //Repositories
    PaymentGatewayCommandRepository,
    PaymentGatewayQueryRepository,
    PaymentGatewayRepository,      
    //Resolvers
    PaymentGatewayResolver,
    //Guards
    PaymentGatewayAuthGuard,
    //Interceptors
    PaymentGatewayInterceptor,
    PaymentGatewayLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentGatewayHandler,
    UpdatePaymentGatewayHandler,
    DeletePaymentGatewayHandler,
    GetPaymentGatewayByIdHandler,
    GetPaymentGatewayByFieldHandler,
    GetAllPaymentGatewayHandler,
    PaymentGatewayCrudSaga,
    //Configurations
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
    PaymentGatewayQueryService,
    PaymentGatewayCommandService,
    //Repositories
    PaymentGatewayCommandRepository,
    PaymentGatewayQueryRepository,
    PaymentGatewayRepository,      
    //Resolvers
    PaymentGatewayResolver,
    //Guards
    PaymentGatewayAuthGuard,
    //Interceptors
    PaymentGatewayInterceptor,
    PaymentGatewayLoggingInterceptor,
  ],
})
export class PaymentGatewayModule {}

