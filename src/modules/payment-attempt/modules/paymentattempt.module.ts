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
import { PaymentAttemptCommandController } from "../controllers/paymentattemptcommand.controller";
import { PaymentAttemptQueryController } from "../controllers/paymentattemptquery.controller";
import { PaymentAttemptCommandService } from "../services/paymentattemptcommand.service";
import { PaymentAttemptQueryService } from "../services/paymentattemptquery.service";
import { PaymentAttemptCommandRepository } from "../repositories/paymentattemptcommand.repository";
import { PaymentAttemptQueryRepository } from "../repositories/paymentattemptquery.repository";
import { PaymentAttemptRepository } from "../repositories/paymentattempt.repository";
import { PaymentAttemptResolver } from "../graphql/paymentattempt.resolver";
import { PaymentAttemptAuthGuard } from "../guards/paymentattemptauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentAttempt } from "../entities/payment-attempt.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentAttemptHandler } from "../commands/handlers/createpaymentattempt.handler";
import { UpdatePaymentAttemptHandler } from "../commands/handlers/updatepaymentattempt.handler";
import { DeletePaymentAttemptHandler } from "../commands/handlers/deletepaymentattempt.handler";
import { GetPaymentAttemptByIdHandler } from "../queries/handlers/getpaymentattemptbyid.handler";
import { GetPaymentAttemptByFieldHandler } from "../queries/handlers/getpaymentattemptbyfield.handler";
import { GetAllPaymentAttemptHandler } from "../queries/handlers/getallpaymentattempt.handler";
import { PaymentAttemptCrudSaga } from "../sagas/paymentattempt-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentAttemptInterceptor } from "../interceptors/paymentattempt.interceptor";
import { PaymentAttemptLoggingInterceptor } from "../interceptors/paymentattempt.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentAttempt]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentAttemptCommandController, PaymentAttemptQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentAttemptQueryService,
    PaymentAttemptCommandService,
    //Repositories
    PaymentAttemptCommandRepository,
    PaymentAttemptQueryRepository,
    PaymentAttemptRepository,      
    //Resolvers
    PaymentAttemptResolver,
    //Guards
    PaymentAttemptAuthGuard,
    //Interceptors
    PaymentAttemptInterceptor,
    PaymentAttemptLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentAttemptHandler,
    UpdatePaymentAttemptHandler,
    DeletePaymentAttemptHandler,
    GetPaymentAttemptByIdHandler,
    GetPaymentAttemptByFieldHandler,
    GetAllPaymentAttemptHandler,
    PaymentAttemptCrudSaga,
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
    PaymentAttemptQueryService,
    PaymentAttemptCommandService,
    //Repositories
    PaymentAttemptCommandRepository,
    PaymentAttemptQueryRepository,
    PaymentAttemptRepository,      
    //Resolvers
    PaymentAttemptResolver,
    //Guards
    PaymentAttemptAuthGuard,
    //Interceptors
    PaymentAttemptInterceptor,
    PaymentAttemptLoggingInterceptor,
  ],
})
export class PaymentAttemptModule {}

