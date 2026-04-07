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
import { PaymentMasterDataCommandController } from "../controllers/paymentmasterdatacommand.controller";
import { PaymentMasterDataQueryController } from "../controllers/paymentmasterdataquery.controller";
import { PaymentMasterDataCommandService } from "../services/paymentmasterdatacommand.service";
import { PaymentMasterDataQueryService } from "../services/paymentmasterdataquery.service";
import { PaymentMasterDataCommandRepository } from "../repositories/paymentmasterdatacommand.repository";
import { PaymentMasterDataQueryRepository } from "../repositories/paymentmasterdataquery.repository";
import { PaymentMasterDataRepository } from "../repositories/paymentmasterdata.repository";
import { PaymentMasterDataResolver } from "../graphql/paymentmasterdata.resolver";
import { PaymentMasterDataAuthGuard } from "../guards/paymentmasterdataauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentMasterData } from "../entities/payment-master-data.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentMasterDataHandler } from "../commands/handlers/createpaymentmasterdata.handler";
import { UpdatePaymentMasterDataHandler } from "../commands/handlers/updatepaymentmasterdata.handler";
import { DeletePaymentMasterDataHandler } from "../commands/handlers/deletepaymentmasterdata.handler";
import { GetPaymentMasterDataByIdHandler } from "../queries/handlers/getpaymentmasterdatabyid.handler";
import { GetPaymentMasterDataByFieldHandler } from "../queries/handlers/getpaymentmasterdatabyfield.handler";
import { GetAllPaymentMasterDataHandler } from "../queries/handlers/getallpaymentmasterdata.handler";
import { PaymentMasterDataCrudSaga } from "../sagas/paymentmasterdata-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentMasterDataInterceptor } from "../interceptors/paymentmasterdata.interceptor";
import { PaymentMasterDataLoggingInterceptor } from "../interceptors/paymentmasterdata.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentMasterData]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [PaymentMasterDataCommandController, PaymentMasterDataQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentMasterDataQueryService,
    PaymentMasterDataCommandService,
    //Repositories
    PaymentMasterDataCommandRepository,
    PaymentMasterDataQueryRepository,
    PaymentMasterDataRepository,      
    //Resolvers
    PaymentMasterDataResolver,
    //Guards
    PaymentMasterDataAuthGuard,
    //Interceptors
    PaymentMasterDataInterceptor,
    PaymentMasterDataLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentMasterDataHandler,
    UpdatePaymentMasterDataHandler,
    DeletePaymentMasterDataHandler,
    GetPaymentMasterDataByIdHandler,
    GetPaymentMasterDataByFieldHandler,
    GetAllPaymentMasterDataHandler,
    PaymentMasterDataCrudSaga,
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
    PaymentMasterDataQueryService,
    PaymentMasterDataCommandService,
    //Repositories
    PaymentMasterDataCommandRepository,
    PaymentMasterDataQueryRepository,
    PaymentMasterDataRepository,      
    //Resolvers
    PaymentMasterDataResolver,
    //Guards
    PaymentMasterDataAuthGuard,
    //Interceptors
    PaymentMasterDataInterceptor,
    PaymentMasterDataLoggingInterceptor,
  ],
})
export class PaymentMasterDataModule {}

