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
import { PaymentAttemptStatusCommandController } from "../controllers/paymentattemptstatuscommand.controller";
import { PaymentAttemptStatusQueryController } from "../controllers/paymentattemptstatusquery.controller";
import { PaymentAttemptStatusCommandService } from "../services/paymentattemptstatuscommand.service";
import { PaymentAttemptStatusQueryService } from "../services/paymentattemptstatusquery.service";

import { PaymentAttemptStatusCommandRepository } from "../repositories/paymentattemptstatuscommand.repository";
import { PaymentAttemptStatusQueryRepository } from "../repositories/paymentattemptstatusquery.repository";
import { PaymentAttemptStatusRepository } from "../repositories/paymentattemptstatus.repository";
import { PaymentAttemptStatusResolver } from "../graphql/paymentattemptstatus.resolver";
import { PaymentAttemptStatusAuthGuard } from "../guards/paymentattemptstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentAttemptStatus } from "../entities/payment-attempt-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentAttemptStatusHandler } from "../commands/handlers/createpaymentattemptstatus.handler";
import { UpdatePaymentAttemptStatusHandler } from "../commands/handlers/updatepaymentattemptstatus.handler";
import { DeletePaymentAttemptStatusHandler } from "../commands/handlers/deletepaymentattemptstatus.handler";
import { GetPaymentAttemptStatusByIdHandler } from "../queries/handlers/getpaymentattemptstatusbyid.handler";
import { GetPaymentAttemptStatusByFieldHandler } from "../queries/handlers/getpaymentattemptstatusbyfield.handler";
import { GetAllPaymentAttemptStatusHandler } from "../queries/handlers/getallpaymentattemptstatus.handler";
import { PaymentAttemptStatusCrudSaga } from "../sagas/paymentattemptstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentAttemptStatusInterceptor } from "../interceptors/paymentattemptstatus.interceptor";
import { PaymentAttemptStatusLoggingInterceptor } from "../interceptors/paymentattemptstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentAttemptStatus]), // Incluir BaseEntity para herencia
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
  controllers: [PaymentAttemptStatusCommandController, PaymentAttemptStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentAttemptStatusQueryService,
    PaymentAttemptStatusCommandService,
  
    //Repositories
    PaymentAttemptStatusCommandRepository,
    PaymentAttemptStatusQueryRepository,
    PaymentAttemptStatusRepository,      
    //Resolvers
    PaymentAttemptStatusResolver,
    //Guards
    PaymentAttemptStatusAuthGuard,
    //Interceptors
    PaymentAttemptStatusInterceptor,
    PaymentAttemptStatusLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentAttemptStatusHandler,
    UpdatePaymentAttemptStatusHandler,
    DeletePaymentAttemptStatusHandler,
    GetPaymentAttemptStatusByIdHandler,
    GetPaymentAttemptStatusByFieldHandler,
    GetAllPaymentAttemptStatusHandler,
    PaymentAttemptStatusCrudSaga,
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
    PaymentAttemptStatusQueryService,
    PaymentAttemptStatusCommandService,
  
    //Repositories
    PaymentAttemptStatusCommandRepository,
    PaymentAttemptStatusQueryRepository,
    PaymentAttemptStatusRepository,      
    //Resolvers
    PaymentAttemptStatusResolver,
    //Guards
    PaymentAttemptStatusAuthGuard,
    //Interceptors
    PaymentAttemptStatusInterceptor,
    PaymentAttemptStatusLoggingInterceptor,
  ],
})
export class PaymentAttemptStatusModule {}

