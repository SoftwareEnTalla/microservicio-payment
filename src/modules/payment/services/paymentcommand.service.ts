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
import { Payment } from "../entities/payment.entity";
import { CreatePaymentDto, UpdatePaymentDto, DeletePaymentDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PaymentCommandRepository } from "../repositories/paymentcommand.repository";
import { PaymentQueryRepository } from "../repositories/paymentquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PaymentQueryService } from "./paymentquery.service";
import { BaseEvent } from "../events/base.event";
import { PaymentSucceededEvent } from '../events/paymentsucceeded.event';

@Injectable()
export class PaymentCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PaymentCommandService.name);
  //Constructo del servicio PaymentCommandService
  constructor(
    private readonly repository: PaymentCommandRepository,
    private readonly queryRepository: PaymentQueryRepository,
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
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
        await this.eventStore.appendEvent('payment-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Payment | null,
    current?: Payment | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: payment-amount-must-be-positive
      // Todo pago debe tener un monto positivo.
      if (!((this.dslValue(entityData, currentData, inputData, 'amount') === undefined || this.dslValue(entityData, currentData, inputData, 'amount') === null || this.dslValue(entityData, currentData, inputData, 'amount') > 0))) {
        throw new Error('PAYMENT_001: El monto del pago debe ser mayor que cero');
      }

      // Regla de servicio: payment-must-have-idempotency-key
      // Todo pago debe incluir una clave de idempotencia.
      if (!((this.dslValue(entityData, currentData, inputData, 'idempotencyKey') !== undefined && this.dslValue(entityData, currentData, inputData, 'idempotencyKey') !== null && this.dslValue(entityData, currentData, inputData, 'idempotencyKey') !== ''))) {
        throw new Error('PAYMENT_002: El pago requiere una clave de idempotencia');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: payment-amount-must-be-positive
      // Todo pago debe tener un monto positivo.
      if (!((this.dslValue(entityData, currentData, inputData, 'amount') === undefined || this.dslValue(entityData, currentData, inputData, 'amount') === null || this.dslValue(entityData, currentData, inputData, 'amount') > 0))) {
        throw new Error('PAYMENT_001: El monto del pago debe ser mayor que cero');
      }

      // Regla de servicio: succeeded-payment-emits-domain-event
      // Cuando un pago pasa a exitoso debe emitirse un evento de dominio.
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'SUCCEEDED') {
        pendingEvents.push(PaymentSucceededEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'payment-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'payment-update')
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
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePaymentDto>("createPayment", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPaymentDtoInput: CreatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      logger.info("Receiving in service:", createPaymentDtoInput);
      const candidate = Payment.fromDto(createPaymentDtoInput);
      await this.applyDslServiceRules("create", createPaymentDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPaymentDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el payment no existe
      if (!entity)
        throw new NotFoundException("Entidad Payment no encontrada.");
      // Devolver payment
      return {
        ok: true,
        message: "Payment obtenido con éxito.",
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
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Payment>("createPayments", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPaymentDtosInput: CreatePaymentDto[]
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPaymentDtosInput.map((entity) => Payment.fromDto(entity))
      );

      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payments creados con éxito.",
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
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentDto>("updatePayment", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Payment(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el payment no existe
      if (!entity)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payment actualizada con éxito.",
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
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentDto>("updatePayments", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePaymentDto[]
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Payment.fromDto(entity))
      );
      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payments actualizadas con éxito.",
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
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePaymentDto>("deletePayment", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el payment no existe
      if (!entity)
        throw new NotFoundException("Instancias de Payment no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver payment
      return {
        ok: true,
        message: "Instancia de Payment eliminada con éxito.",
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
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePayments", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

