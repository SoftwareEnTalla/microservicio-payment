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
import { PaymentGatewayStatusCommandController } from "../controllers/paymentgatewaystatuscommand.controller";
import { PaymentGatewayStatusQueryController } from "../controllers/paymentgatewaystatusquery.controller";
import { PaymentGatewayStatusCommandService } from "../services/paymentgatewaystatuscommand.service";
import { PaymentGatewayStatusQueryService } from "../services/paymentgatewaystatusquery.service";

import { PaymentGatewayStatusCommandRepository } from "../repositories/paymentgatewaystatuscommand.repository";
import { PaymentGatewayStatusQueryRepository } from "../repositories/paymentgatewaystatusquery.repository";
import { PaymentGatewayStatusRepository } from "../repositories/paymentgatewaystatus.repository";
import { PaymentGatewayStatusResolver } from "../graphql/paymentgatewaystatus.resolver";
import { PaymentGatewayStatusAuthGuard } from "../guards/paymentgatewaystatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentGatewayStatus } from "../entities/payment-gateway-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentGatewayStatusHandler } from "../commands/handlers/createpaymentgatewaystatus.handler";
import { UpdatePaymentGatewayStatusHandler } from "../commands/handlers/updatepaymentgatewaystatus.handler";
import { DeletePaymentGatewayStatusHandler } from "../commands/handlers/deletepaymentgatewaystatus.handler";
import { GetPaymentGatewayStatusByIdHandler } from "../queries/handlers/getpaymentgatewaystatusbyid.handler";
import { GetPaymentGatewayStatusByFieldHandler } from "../queries/handlers/getpaymentgatewaystatusbyfield.handler";
import { GetAllPaymentGatewayStatusHandler } from "../queries/handlers/getallpaymentgatewaystatus.handler";
import { PaymentGatewayStatusCrudSaga } from "../sagas/paymentgatewaystatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentGatewayStatusInterceptor } from "../interceptors/paymentgatewaystatus.interceptor";
import { PaymentGatewayStatusLoggingInterceptor } from "../interceptors/paymentgatewaystatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentGatewayStatus]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [PaymentGatewayStatusCommandController, PaymentGatewayStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentGatewayStatusQueryService,
    PaymentGatewayStatusCommandService,
  
    //Repositories
    PaymentGatewayStatusCommandRepository,
    PaymentGatewayStatusQueryRepository,
    PaymentGatewayStatusRepository,      
    //Resolvers
    PaymentGatewayStatusResolver,
    //Guards
    PaymentGatewayStatusAuthGuard,
    //Interceptors
    PaymentGatewayStatusInterceptor,
    PaymentGatewayStatusLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentGatewayStatusHandler,
    UpdatePaymentGatewayStatusHandler,
    DeletePaymentGatewayStatusHandler,
    GetPaymentGatewayStatusByIdHandler,
    GetPaymentGatewayStatusByFieldHandler,
    GetAllPaymentGatewayStatusHandler,
    PaymentGatewayStatusCrudSaga,
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
    PaymentGatewayStatusQueryService,
    PaymentGatewayStatusCommandService,
  
    //Repositories
    PaymentGatewayStatusCommandRepository,
    PaymentGatewayStatusQueryRepository,
    PaymentGatewayStatusRepository,      
    //Resolvers
    PaymentGatewayStatusResolver,
    //Guards
    PaymentGatewayStatusAuthGuard,
    //Interceptors
    PaymentGatewayStatusInterceptor,
    PaymentGatewayStatusLoggingInterceptor,
  ],
})
export class PaymentGatewayStatusModule {}

