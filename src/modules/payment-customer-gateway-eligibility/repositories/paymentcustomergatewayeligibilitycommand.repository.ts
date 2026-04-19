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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { PaymentCustomerGatewayEligibility } from '../entities/payment-customer-gateway-eligibility.entity';
import { PaymentCustomerGatewayEligibilityQueryRepository } from './paymentcustomergatewayeligibilityquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {PaymentCustomerGatewayEligibilityRepository} from './paymentcustomergatewayeligibility.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { PaymentCustomerGatewayEligibilityCreatedEvent } from '../events/paymentcustomergatewayeligibilitycreated.event';
import { PaymentCustomerGatewayEligibilityUpdatedEvent } from '../events/paymentcustomergatewayeligibilityupdated.event';
import { PaymentCustomerGatewayEligibilityDeletedEvent } from '../events/paymentcustomergatewayeligibilitydeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(PaymentCustomerGatewayEligibilityCreatedEvent, PaymentCustomerGatewayEligibilityUpdatedEvent, PaymentCustomerGatewayEligibilityDeletedEvent)
@Injectable()
export class PaymentCustomerGatewayEligibilityCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: PaymentCustomerGatewayEligibilityCommandRepository
  constructor(
    @InjectRepository(PaymentCustomerGatewayEligibility)
    private readonly repository: Repository<PaymentCustomerGatewayEligibility>,
    private readonly paymentcustomergatewayeligibilityRepository: PaymentCustomerGatewayEligibilityQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(PaymentCustomerGatewayEligibility.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${PaymentCustomerGatewayEligibility.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle PaymentCustomerGatewayEligibility event on repository:', event);
    switch (event.constructor.name) {
      case 'PaymentCustomerGatewayEligibilityCreatedEvent':
        return await this.onPaymentCustomerGatewayEligibilityCreated(event);
      case 'PaymentCustomerGatewayEligibilityUpdatedEvent':
        return await this.onPaymentCustomerGatewayEligibilityUpdated(event);
      case 'PaymentCustomerGatewayEligibilityDeletedEvent':
        return await this.onPaymentCustomerGatewayEligibilityDeleted(event);

    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility>('createPaymentCustomerGatewayEligibility', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentCustomerGatewayEligibilityCreated(event: PaymentCustomerGatewayEligibilityCreatedEvent) {
    logger.info('Ready to handle onPaymentCustomerGatewayEligibilityCreated event on repository:', event);
    const entity = new PaymentCustomerGatewayEligibility();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'paymentcustomergatewayeligibility';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility>('updatePaymentCustomerGatewayEligibility', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentCustomerGatewayEligibilityUpdated(event: PaymentCustomerGatewayEligibilityUpdatedEvent) {
    logger.info('Ready to handle onPaymentCustomerGatewayEligibilityUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility>('deletePaymentCustomerGatewayEligibility', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentCustomerGatewayEligibilityDeleted(event: PaymentCustomerGatewayEligibilityDeletedEvent) {
    logger.info('Ready to handle onPaymentCustomerGatewayEligibilityDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }



  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility>('createPaymentCustomerGatewayEligibility',args[0], args[1]), ttl: 60 })
  async create(entity: PaymentCustomerGatewayEligibility): Promise<PaymentCustomerGatewayEligibility> {
    logger.info('Ready to create PaymentCustomerGatewayEligibility on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'paymentcustomergatewayeligibility';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of PaymentCustomerGatewayEligibility was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvt1 = new PaymentCustomerGatewayEligibilityCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(__dualEvt1);
      this.eventPublisher.publish(__dualEvt1);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility[]>('createPaymentCustomerGatewayEligibilitys',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: PaymentCustomerGatewayEligibility[]): Promise<PaymentCustomerGatewayEligibility[]> {
    logger.info('Ready to create PaymentCustomerGatewayEligibility on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'paymentcustomergatewayeligibility';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of PaymentCustomerGatewayEligibility was created on repository:', result);
    
    // Publicar eventos solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvts2 = result.map((el)=>new PaymentCustomerGatewayEligibilityCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      __dualEvts2.forEach((ev: any) => this.eventBus.publish(ev));
      this.eventPublisher.publishAll(__dualEvts2);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility>('updatePaymentCustomerGatewayEligibility',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<PaymentCustomerGatewayEligibility>
  ): Promise<PaymentCustomerGatewayEligibility | null> {
    logger.info('Ready to update PaymentCustomerGatewayEligibility on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update PaymentCustomerGatewayEligibility on repository was successfully :', partialEntity);
    let instance=await this.paymentcustomergatewayeligibilityRepository.findById(id);
    logger.info('Updated instance of PaymentCustomerGatewayEligibility with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event PaymentCustomerGatewayEligibilityUpdatedEvent on repository:', instance);
      const __dualEvt3 = new PaymentCustomerGatewayEligibilityUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(__dualEvt3);
      this.eventPublisher.publish(__dualEvt3);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentCustomerGatewayEligibility[]>('updatePaymentCustomerGatewayEligibilitys',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<PaymentCustomerGatewayEligibility>[]): Promise<PaymentCustomerGatewayEligibility[]> {
    const updatedEntities: PaymentCustomerGatewayEligibility[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const __dualEvt4 = new PaymentCustomerGatewayEligibilityUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(__dualEvt4);
            this.eventPublisher.publish(__dualEvt4);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deletePaymentCustomerGatewayEligibility',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.paymentcustomergatewayeligibilityRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire PaymentCustomerGatewayEligibilityDeletedEvent on repository:', result);
       const __dualEvt5 = new PaymentCustomerGatewayEligibilityDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(__dualEvt5);
       this.eventPublisher.publish(__dualEvt5);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentCustomerGatewayEligibilityRepository.name)
      .get(PaymentCustomerGatewayEligibilityRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deletePaymentCustomerGatewayEligibilitys',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire PaymentCustomerGatewayEligibilityDeletedEvent on repository:', result);
      const __dualEvts6 = await Promise.all(ids.map(async (id) => {
          const entity = await this.paymentcustomergatewayeligibilityRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new PaymentCustomerGatewayEligibilityDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      __dualEvts6.forEach((ev: any) => this.eventBus.publish(ev));
      this.eventPublisher.publishAll(__dualEvts6);
    }
    return result;
  }
}


