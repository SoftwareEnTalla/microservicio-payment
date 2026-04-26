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
import { PaymentStatusCommandController } from "../controllers/paymentstatuscommand.controller";
import { PaymentStatusQueryController } from "../controllers/paymentstatusquery.controller";
import { PaymentStatusCommandService } from "../services/paymentstatuscommand.service";
import { PaymentStatusQueryService } from "../services/paymentstatusquery.service";

import { PaymentStatusCommandRepository } from "../repositories/paymentstatuscommand.repository";
import { PaymentStatusQueryRepository } from "../repositories/paymentstatusquery.repository";
import { PaymentStatusRepository } from "../repositories/paymentstatus.repository";
import { PaymentStatusResolver } from "../graphql/paymentstatus.resolver";
import { PaymentStatusAuthGuard } from "../guards/paymentstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentStatus } from "../entities/payment-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentStatusHandler } from "../commands/handlers/createpaymentstatus.handler";
import { UpdatePaymentStatusHandler } from "../commands/handlers/updatepaymentstatus.handler";
import { DeletePaymentStatusHandler } from "../commands/handlers/deletepaymentstatus.handler";
import { GetPaymentStatusByIdHandler } from "../queries/handlers/getpaymentstatusbyid.handler";
import { GetPaymentStatusByFieldHandler } from "../queries/handlers/getpaymentstatusbyfield.handler";
import { GetAllPaymentStatusHandler } from "../queries/handlers/getallpaymentstatus.handler";
import { PaymentStatusCrudSaga } from "../sagas/paymentstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentStatusInterceptor } from "../interceptors/paymentstatus.interceptor";
import { PaymentStatusLoggingInterceptor } from "../interceptors/paymentstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentStatus]), // Incluir BaseEntity para herencia
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
  controllers: [PaymentStatusCommandController, PaymentStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentStatusQueryService,
    PaymentStatusCommandService,
  
    //Repositories
    PaymentStatusCommandRepository,
    PaymentStatusQueryRepository,
    PaymentStatusRepository,      
    //Resolvers
    PaymentStatusResolver,
    //Guards
    PaymentStatusAuthGuard,
    //Interceptors
    PaymentStatusInterceptor,
    PaymentStatusLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentStatusHandler,
    UpdatePaymentStatusHandler,
    DeletePaymentStatusHandler,
    GetPaymentStatusByIdHandler,
    GetPaymentStatusByFieldHandler,
    GetAllPaymentStatusHandler,
    PaymentStatusCrudSaga,
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
    PaymentStatusQueryService,
    PaymentStatusCommandService,
  
    //Repositories
    PaymentStatusCommandRepository,
    PaymentStatusQueryRepository,
    PaymentStatusRepository,      
    //Resolvers
    PaymentStatusResolver,
    //Guards
    PaymentStatusAuthGuard,
    //Interceptors
    PaymentStatusInterceptor,
    PaymentStatusLoggingInterceptor,
  ],
})
export class PaymentStatusModule {}

