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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { PaymentMasterData } from "../entities/payment-master-data.entity";
import { CreatePaymentMasterDataDto, UpdatePaymentMasterDataDto, DeletePaymentMasterDataDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PaymentMasterDataCommandRepository } from "../repositories/paymentmasterdatacommand.repository";
import { PaymentMasterDataQueryRepository } from "../repositories/paymentmasterdataquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentMasterDataResponse, PaymentMasterDatasResponse } from "../types/paymentmasterdata.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PaymentMasterDataQueryService } from "./paymentmasterdataquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class PaymentMasterDataCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PaymentMasterDataCommandService.name);
  //Constructo del servicio PaymentMasterDataCommandService
  constructor(
    private readonly repository: PaymentMasterDataCommandRepository,
    private readonly queryRepository: PaymentMasterDataQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataQueryService.name)
      .get(PaymentMasterDataQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('payment-master-data-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: PaymentMasterData | null,
    current?: PaymentMasterData | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: master-data-code-required
      // Todo dato maestro debe tener un código definido.
      if (!((this.dslValue(entityData, currentData, inputData, 'code') !== undefined && this.dslValue(entityData, currentData, inputData, 'code') !== null && this.dslValue(entityData, currentData, inputData, 'code') !== ''))) {
        throw new Error('PAYMENT_MD_001: El dato maestro requiere un código');
      }

      // Regla de servicio: master-data-category-required
      // Todo dato maestro debe pertenecer a una categoría.
      if (!((this.dslValue(entityData, currentData, inputData, 'category') !== undefined && this.dslValue(entityData, currentData, inputData, 'category') !== null && this.dslValue(entityData, currentData, inputData, 'category') !== ''))) {
        throw new Error('PAYMENT_MD_002: El dato maestro requiere una categoría');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: master-data-code-required
      // Todo dato maestro debe tener un código definido.
      if (!((this.dslValue(entityData, currentData, inputData, 'code') !== undefined && this.dslValue(entityData, currentData, inputData, 'code') !== null && this.dslValue(entityData, currentData, inputData, 'code') !== ''))) {
        throw new Error('PAYMENT_MD_001: El dato maestro requiere un código');
      }

      // Regla de servicio: master-data-category-required
      // Todo dato maestro debe pertenecer a una categoría.
      if (!((this.dslValue(entityData, currentData, inputData, 'category') !== undefined && this.dslValue(entityData, currentData, inputData, 'category') !== null && this.dslValue(entityData, currentData, inputData, 'category') !== ''))) {
        throw new Error('PAYMENT_MD_002: El dato maestro requiere una categoría');
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataCommandService.name)
      .get(PaymentMasterDataCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePaymentMasterDataDto>("createPaymentMasterData", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPaymentMasterDataDtoInput: CreatePaymentMasterDataDto
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
    try {
      logger.info("Receiving in service:", createPaymentMasterDataDtoInput);
      const candidate = PaymentMasterData.fromDto(createPaymentMasterDataDtoInput);
      await this.applyDslServiceRules("create", createPaymentMasterDataDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPaymentMasterDataDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el paymentmasterdata no existe
      if (!entity)
        throw new NotFoundException("Entidad PaymentMasterData no encontrada.");
      // Devolver paymentmasterdata
      return {
        ok: true,
        message: "PaymentMasterData obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataCommandService.name)
      .get(PaymentMasterDataCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<PaymentMasterData>("createPaymentMasterDatas", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPaymentMasterDataDtosInput: CreatePaymentMasterDataDto[]
  ): Promise<PaymentMasterDatasResponse<PaymentMasterData>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPaymentMasterDataDtosInput.map((entity) => PaymentMasterData.fromDto(entity))
      );

      // Respuesta si el paymentmasterdata no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentMasterDatas no encontradas.");
      // Devolver paymentmasterdata
      return {
        ok: true,
        message: "PaymentMasterDatas creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataCommandService.name)
      .get(PaymentMasterDataCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentMasterDataDto>("updatePaymentMasterData", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePaymentMasterDataDto
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new PaymentMasterData(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el paymentmasterdata no existe
      if (!entity)
        throw new NotFoundException("Entidades PaymentMasterDatas no encontradas.");
      // Devolver paymentmasterdata
      return {
        ok: true,
        message: "PaymentMasterData actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataCommandService.name)
      .get(PaymentMasterDataCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentMasterDataDto>("updatePaymentMasterDatas", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePaymentMasterDataDto[]
  ): Promise<PaymentMasterDatasResponse<PaymentMasterData>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => PaymentMasterData.fromDto(entity))
      );
      // Respuesta si el paymentmasterdata no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentMasterDatas no encontradas.");
      // Devolver paymentmasterdata
      return {
        ok: true,
        message: "PaymentMasterDatas actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataCommandService.name)
      .get(PaymentMasterDataCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePaymentMasterDataDto>("deletePaymentMasterData", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el paymentmasterdata no existe
      if (!entity)
        throw new NotFoundException("Instancias de PaymentMasterData no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver paymentmasterdata
      return {
        ok: true,
        message: "Instancia de PaymentMasterData eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentMasterDataCommandService.name)
      .get(PaymentMasterDataCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePaymentMasterDatas", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

