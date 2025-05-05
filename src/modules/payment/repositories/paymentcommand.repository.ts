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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { Payment } from '../entities/payment.entity';
import { PaymentQueryRepository } from './paymentquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {PaymentRepository} from './payment.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler } from '@nestjs/cqrs';
import { PaymentCreatedEvent } from '../events/paymentcreated.event';
import { PaymentUpdatedEvent } from '../events/paymentupdated.event';
import { PaymentDeletedEvent } from '../events/paymentdeleted.event';

//Enfoque Event Sourcing
import { CommandBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';


@Injectable()
export class PaymentCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: PaymentCommandRepository
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
    private readonly paymentRepository: PaymentQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(Payment.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${Payment.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  async handle(event: any) {
    logger.info('Ready to handle Payment event on repository:', event);
    switch (event.constructor.name) {
      case 'PaymentCreatedEvent':
        return await this.onPaymentCreated(event);
      case 'PaymentUpdatedEvent':
        return await this.onPaymentUpdated(event);
      case 'PaymentDeletedEvent':
        return await this.onPaymentDeleted(event);
      // Añade más casos según necesites
    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payment>('createPayment', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentCreated(event: PaymentCreatedEvent) {
    logger.info('Ready to handle onPaymentCreated event on repository:', event);
    const entity = new Payment();
    entity.id = event.aggregateId;
    // Mapea todos los campos del evento a la entidad
    Object.assign(entity, event.payload.instance);
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
    // Limpia caché si es necesario
  }

  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payment>('updatePayment', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentUpdated(event: PaymentUpdatedEvent) {
    logger.info('Ready to handle onPaymentUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
    // Limpia caché relacionada
  }

  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payment>('deletePayment', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentDeleted(event: PaymentDeletedEvent) {
    logger.info('Ready to handle onPaymentDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
    // Limpia caché
  }


  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  
  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payment>('createPayment',args[0], args[1]), ttl: 60 })
  async create(entity: Payment): Promise<Payment> {
    logger.info('Ready to create Payment on repository:', entity);
    const result = await this.repository.save(entity);
    logger.info('New instance of Payment was created with id:'+ result.id+' on repository:', result);
    this.eventPublisher.publish(new PaymentCreatedEvent(result.id, {
      instance: result,
      metadata: {
        initiatedBy: result.creator,
        correlationId: result.id,
      },
    }));
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payment[]>('createPayments',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: Payment[]): Promise<Payment[]> {
    logger.info('Ready to create Payment on repository:', entities);
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of Payment was created on repository:', result);
    this.eventPublisher.publishAll(result.map((el)=>new PaymentCreatedEvent(el.id, {
      instance: el,
      metadata: {
        initiatedBy: el.creator,
        correlationId: el.id,
      },
    })));
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payment>('updatePayment',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<Payment>
  ): Promise<Payment | null> {
    logger.info('Ready to update Payment on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update Payment on repository was successfully :', partialEntity);
    let instance=await this.paymentRepository.findById(id);
    logger.info('Updated instance of Payment with id:  was finded on repository:', instance);
    if(instance){
     logger.info('Ready to publish or fire event PaymentUpdatedEvent on repository:', instance);
     this.eventPublisher.publish(new PaymentUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        }));
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payment[]>('updatePayments',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<Payment>[]): Promise<Payment[]> {
    const updatedEntities: Payment[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          this.eventPublisher.publish(new PaymentUpdatedEvent(updatedEntity.id, {
              instance: updatedEntity,
              metadata: {
                initiatedBy: updatedEntity.createdBy || 'system',
                correlationId: entity.id,
              },
            }));
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deletePayment',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete  entity with id:  on repository:', id);
     const entity = await this.paymentRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id:  on repository:', result);
     logger.info('Ready to publish/fire PaymentDeletedEvent on repository:', result);
     this.eventPublisher.publish(new PaymentDeletedEvent(id, {
      instance: entity,
      metadata: {
        initiatedBy: entity.createdBy || 'system',
        correlationId: entity.id,
      },
    }));
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deletePayments',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    logger.info('Ready to publish/fire PaymentDeletedEvent on repository:', result);
    this.eventPublisher.publishAll(ids.map(async (id) => {
        const entity = await this.paymentRepository.findOne({ id });
        if(!entity){
          throw new NotFoundException(`No se encontro el id: ${id}`);
        }
        return new PaymentDeletedEvent(id, {
          instance: entity,
          metadata: {
            initiatedBy: entity.createdBy || 'system',
            correlationId: entity.id,
          },
        });
      }));
    return result;
  }
}


