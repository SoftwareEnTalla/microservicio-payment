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
import { PaymentAttempt } from "../entities/payment-attempt.entity";
import { CreatePaymentAttemptDto, UpdatePaymentAttemptDto, DeletePaymentAttemptDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PaymentAttemptCommandRepository } from "../repositories/paymentattemptcommand.repository";
import { PaymentAttemptQueryRepository } from "../repositories/paymentattemptquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentAttemptResponse, PaymentAttemptsResponse } from "../types/paymentattempt.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PaymentAttemptQueryService } from "./paymentattemptquery.service";
import { BaseEvent } from "../events/base.event";
import { PaymentFailedEvent } from '../events/paymentfailed.event';

@Injectable()
export class PaymentAttemptCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PaymentAttemptCommandService.name);
  //Constructo del servicio PaymentAttemptCommandService
  constructor(
    private readonly repository: PaymentAttemptCommandRepository,
    private readonly queryRepository: PaymentAttemptQueryRepository,
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
      .registerClient(PaymentAttemptQueryService.name)
      .get(PaymentAttemptQueryService.name),
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
        await this.eventStore.appendEvent('payment-attempt-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: PaymentAttempt | null,
    current?: PaymentAttempt | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: attempt-number-must-be-positive
      // Todo intento debe tener un número secuencial positivo.
      if (!((this.dslValue(entityData, currentData, inputData, 'attemptNumber') === undefined || this.dslValue(entityData, currentData, inputData, 'attemptNumber') === null || this.dslValue(entityData, currentData, inputData, 'attemptNumber') > 0))) {
        throw new Error('PAYMENT_ATTEMPT_001: El número del intento debe ser mayor que cero');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: failed-attempt-emits-domain-event
      // Cuando un intento falla debe emitirse un evento de fallo.
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'FAILED') {
        pendingEvents.push(PaymentFailedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'payment-attempt-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'payment-attempt-update')
        ));
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
      .registerClient(PaymentAttemptCommandService.name)
      .get(PaymentAttemptCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePaymentAttemptDto>("createPaymentAttempt", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPaymentAttemptDtoInput: CreatePaymentAttemptDto
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
    try {
      logger.info("Receiving in service:", createPaymentAttemptDtoInput);
      const candidate = PaymentAttempt.fromDto(createPaymentAttemptDtoInput);
      await this.applyDslServiceRules("create", createPaymentAttemptDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPaymentAttemptDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el paymentattempt no existe
      if (!entity)
        throw new NotFoundException("Entidad PaymentAttempt no encontrada.");
      // Devolver paymentattempt
      return {
        ok: true,
        message: "PaymentAttempt obtenido con éxito.",
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
      .registerClient(PaymentAttemptCommandService.name)
      .get(PaymentAttemptCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<PaymentAttempt>("createPaymentAttempts", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPaymentAttemptDtosInput: CreatePaymentAttemptDto[]
  ): Promise<PaymentAttemptsResponse<PaymentAttempt>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPaymentAttemptDtosInput.map((entity) => PaymentAttempt.fromDto(entity))
      );

      // Respuesta si el paymentattempt no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentAttempts no encontradas.");
      // Devolver paymentattempt
      return {
        ok: true,
        message: "PaymentAttempts creados con éxito.",
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
      .registerClient(PaymentAttemptCommandService.name)
      .get(PaymentAttemptCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentAttemptDto>("updatePaymentAttempt", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePaymentAttemptDto
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new PaymentAttempt(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el paymentattempt no existe
      if (!entity)
        throw new NotFoundException("Entidades PaymentAttempts no encontradas.");
      // Devolver paymentattempt
      return {
        ok: true,
        message: "PaymentAttempt actualizada con éxito.",
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
      .registerClient(PaymentAttemptCommandService.name)
      .get(PaymentAttemptCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentAttemptDto>("updatePaymentAttempts", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePaymentAttemptDto[]
  ): Promise<PaymentAttemptsResponse<PaymentAttempt>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => PaymentAttempt.fromDto(entity))
      );
      // Respuesta si el paymentattempt no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentAttempts no encontradas.");
      // Devolver paymentattempt
      return {
        ok: true,
        message: "PaymentAttempts actualizadas con éxito.",
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
      .registerClient(PaymentAttemptCommandService.name)
      .get(PaymentAttemptCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePaymentAttemptDto>("deletePaymentAttempt", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PaymentAttemptResponse<PaymentAttempt>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el paymentattempt no existe
      if (!entity)
        throw new NotFoundException("Instancias de PaymentAttempt no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver paymentattempt
      return {
        ok: true,
        message: "Instancia de PaymentAttempt eliminada con éxito.",
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
      .registerClient(PaymentAttemptCommandService.name)
      .get(PaymentAttemptCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePaymentAttempts", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

