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
import { PaymentMethodTypeCommandController } from "../controllers/paymentmethodtypecommand.controller";
import { PaymentMethodTypeQueryController } from "../controllers/paymentmethodtypequery.controller";
import { PaymentMethodTypeCommandService } from "../services/paymentmethodtypecommand.service";
import { PaymentMethodTypeQueryService } from "../services/paymentmethodtypequery.service";

import { PaymentMethodTypeCommandRepository } from "../repositories/paymentmethodtypecommand.repository";
import { PaymentMethodTypeQueryRepository } from "../repositories/paymentmethodtypequery.repository";
import { PaymentMethodTypeRepository } from "../repositories/paymentmethodtype.repository";
import { PaymentMethodTypeResolver } from "../graphql/paymentmethodtype.resolver";
import { PaymentMethodTypeAuthGuard } from "../guards/paymentmethodtypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentMethodType } from "../entities/payment-method-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentMethodTypeHandler } from "../commands/handlers/createpaymentmethodtype.handler";
import { UpdatePaymentMethodTypeHandler } from "../commands/handlers/updatepaymentmethodtype.handler";
import { DeletePaymentMethodTypeHandler } from "../commands/handlers/deletepaymentmethodtype.handler";
import { GetPaymentMethodTypeByIdHandler } from "../queries/handlers/getpaymentmethodtypebyid.handler";
import { GetPaymentMethodTypeByFieldHandler } from "../queries/handlers/getpaymentmethodtypebyfield.handler";
import { GetAllPaymentMethodTypeHandler } from "../queries/handlers/getallpaymentmethodtype.handler";
import { PaymentMethodTypeCrudSaga } from "../sagas/paymentmethodtype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentMethodTypeInterceptor } from "../interceptors/paymentmethodtype.interceptor";
import { PaymentMethodTypeLoggingInterceptor } from "../interceptors/paymentmethodtype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentMethodType]), // Incluir BaseEntity para herencia
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
  controllers: [PaymentMethodTypeCommandController, PaymentMethodTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentMethodTypeQueryService,
    PaymentMethodTypeCommandService,
  
    //Repositories
    PaymentMethodTypeCommandRepository,
    PaymentMethodTypeQueryRepository,
    PaymentMethodTypeRepository,      
    //Resolvers
    PaymentMethodTypeResolver,
    //Guards
    PaymentMethodTypeAuthGuard,
    //Interceptors
    PaymentMethodTypeInterceptor,
    PaymentMethodTypeLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentMethodTypeHandler,
    UpdatePaymentMethodTypeHandler,
    DeletePaymentMethodTypeHandler,
    GetPaymentMethodTypeByIdHandler,
    GetPaymentMethodTypeByFieldHandler,
    GetAllPaymentMethodTypeHandler,
    PaymentMethodTypeCrudSaga,
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
    PaymentMethodTypeQueryService,
    PaymentMethodTypeCommandService,
  
    //Repositories
    PaymentMethodTypeCommandRepository,
    PaymentMethodTypeQueryRepository,
    PaymentMethodTypeRepository,      
    //Resolvers
    PaymentMethodTypeResolver,
    //Guards
    PaymentMethodTypeAuthGuard,
    //Interceptors
    PaymentMethodTypeInterceptor,
    PaymentMethodTypeLoggingInterceptor,
  ],
})
export class PaymentMethodTypeModule {}

