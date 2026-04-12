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
import { PaymentCustomerGatewayEligibility } from "../entities/payment-customer-gateway-eligibility.entity";
import { CreatePaymentCustomerGatewayEligibilityDto, UpdatePaymentCustomerGatewayEligibilityDto, DeletePaymentCustomerGatewayEligibilityDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PaymentCustomerGatewayEligibilityCommandRepository } from "../repositories/paymentcustomergatewayeligibilitycommand.repository";
import { PaymentCustomerGatewayEligibilityQueryRepository } from "../repositories/paymentcustomergatewayeligibilityquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentCustomerGatewayEligibilityResponse, PaymentCustomerGatewayEligibilitysResponse } from "../types/paymentcustomergatewayeligibility.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PaymentCustomerGatewayEligibilityQueryService } from "./paymentcustomergatewayeligibilityquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class PaymentCustomerGatewayEligibilityCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PaymentCustomerGatewayEligibilityCommandService.name);
  //Constructo del servicio PaymentCustomerGatewayEligibilityCommandService
  constructor(
    private readonly repository: PaymentCustomerGatewayEligibilityCommandRepository,
    private readonly queryRepository: PaymentCustomerGatewayEligibilityQueryRepository,
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
      .registerClient(PaymentCustomerGatewayEligibilityQueryService.name)
      .get(PaymentCustomerGatewayEligibilityQueryService.name),
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
        await this.eventStore.appendEvent('payment-customer-gateway-eligibility-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: PaymentCustomerGatewayEligibility | null,
    current?: PaymentCustomerGatewayEligibility | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: approved-eligibility-cannot-require-revalidation-by-default
      // Una elegibilidad aprobada no debería requerir revalidación salvo señal explícita del bounded context customer.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') !== 'APPROVED' && this.dslValue(entityData, currentData, inputData, 'requiresRevalidation') === false)) {
        logger.warn('PAYMENT_CUSTOMER_GATEWAY_ELIGIBILITY_001: Una elegibilidad aprobada no debe marcar revalidación salvo decisión explícita');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: approved-eligibility-cannot-require-revalidation-by-default
      // Una elegibilidad aprobada no debería requerir revalidación salvo señal explícita del bounded context customer.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') !== 'APPROVED' && this.dslValue(entityData, currentData, inputData, 'requiresRevalidation') === false)) {
        logger.warn('PAYMENT_CUSTOMER_GATEWAY_ELIGIBILITY_001: Una elegibilidad aprobada no debe marcar revalidación salvo decisión explícita');
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
      .registerClient(PaymentCustomerGatewayEligibilityCommandService.name)
      .get(PaymentCustomerGatewayEligibilityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePaymentCustomerGatewayEligibilityDto>("createPaymentCustomerGatewayEligibility", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPaymentCustomerGatewayEligibilityDtoInput: CreatePaymentCustomerGatewayEligibilityDto
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
    try {
      logger.info("Receiving in service:", createPaymentCustomerGatewayEligibilityDtoInput);
      const candidate = PaymentCustomerGatewayEligibility.fromDto(createPaymentCustomerGatewayEligibilityDtoInput);
      await this.applyDslServiceRules("create", createPaymentCustomerGatewayEligibilityDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPaymentCustomerGatewayEligibilityDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el paymentcustomergatewayeligibility no existe
      if (!entity)
        throw new NotFoundException("Entidad PaymentCustomerGatewayEligibility no encontrada.");
      // Devolver paymentcustomergatewayeligibility
      return {
        ok: true,
        message: "PaymentCustomerGatewayEligibility obtenido con éxito.",
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
      .registerClient(PaymentCustomerGatewayEligibilityCommandService.name)
      .get(PaymentCustomerGatewayEligibilityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<PaymentCustomerGatewayEligibility>("createPaymentCustomerGatewayEligibilitys", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPaymentCustomerGatewayEligibilityDtosInput: CreatePaymentCustomerGatewayEligibilityDto[]
  ): Promise<PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPaymentCustomerGatewayEligibilityDtosInput.map((entity) => PaymentCustomerGatewayEligibility.fromDto(entity))
      );

      // Respuesta si el paymentcustomergatewayeligibility no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentCustomerGatewayEligibilitys no encontradas.");
      // Devolver paymentcustomergatewayeligibility
      return {
        ok: true,
        message: "PaymentCustomerGatewayEligibilitys creados con éxito.",
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
      .registerClient(PaymentCustomerGatewayEligibilityCommandService.name)
      .get(PaymentCustomerGatewayEligibilityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentCustomerGatewayEligibilityDto>("updatePaymentCustomerGatewayEligibility", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePaymentCustomerGatewayEligibilityDto
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new PaymentCustomerGatewayEligibility(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el paymentcustomergatewayeligibility no existe
      if (!entity)
        throw new NotFoundException("Entidades PaymentCustomerGatewayEligibilitys no encontradas.");
      // Devolver paymentcustomergatewayeligibility
      return {
        ok: true,
        message: "PaymentCustomerGatewayEligibility actualizada con éxito.",
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
      .registerClient(PaymentCustomerGatewayEligibilityCommandService.name)
      .get(PaymentCustomerGatewayEligibilityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentCustomerGatewayEligibilityDto>("updatePaymentCustomerGatewayEligibilitys", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePaymentCustomerGatewayEligibilityDto[]
  ): Promise<PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => PaymentCustomerGatewayEligibility.fromDto(entity))
      );
      // Respuesta si el paymentcustomergatewayeligibility no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentCustomerGatewayEligibilitys no encontradas.");
      // Devolver paymentcustomergatewayeligibility
      return {
        ok: true,
        message: "PaymentCustomerGatewayEligibilitys actualizadas con éxito.",
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
      .registerClient(PaymentCustomerGatewayEligibilityCommandService.name)
      .get(PaymentCustomerGatewayEligibilityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePaymentCustomerGatewayEligibilityDto>("deletePaymentCustomerGatewayEligibility", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el paymentcustomergatewayeligibility no existe
      if (!entity)
        throw new NotFoundException("Instancias de PaymentCustomerGatewayEligibility no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver paymentcustomergatewayeligibility
      return {
        ok: true,
        message: "Instancia de PaymentCustomerGatewayEligibility eliminada con éxito.",
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
      .registerClient(PaymentCustomerGatewayEligibilityCommandService.name)
      .get(PaymentCustomerGatewayEligibilityCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePaymentCustomerGatewayEligibilitys", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

