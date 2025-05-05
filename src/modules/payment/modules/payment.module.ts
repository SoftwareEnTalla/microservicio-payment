/*
 * Copyright (c) 2025 SoftwarEnTalla
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

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaService } from "../shared/messaging/kafka.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), // Asegúrate de incluir esto
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentCommandController, PaymentQueryController],
  providers: [
    //Services
    EventStoreService,
    KafkaService,
    PaymentQueryService,
    PaymentCommandService,
    //Repositories
    PaymentCommandRepository,
    PaymentQueryRepository,
    PaymentRepository,      
    //Resolvers
    PaymentResolver,
    //Guards
    PaymentAuthGuard,
    //Interceptors
    PaymentInterceptor,
    PaymentLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    //Services
    EventStoreService,
    KafkaService,
    PaymentQueryService,
    PaymentCommandService,
    //Repositories
    PaymentCommandRepository,
    PaymentQueryRepository,
    PaymentRepository,      
    //Resolvers
    PaymentResolver,
    //Guards
    PaymentAuthGuard,
    //Interceptors
    PaymentInterceptor,
    PaymentLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class PaymentModule {}

