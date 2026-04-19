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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  PaymentAttemptCreatedEvent,
  PaymentAttemptUpdatedEvent,
  PaymentAttemptDeletedEvent,
  PaymentFailedEvent,
} from '../events/exporting.event';
import {
  SagaPaymentAttemptFailedEvent
} from '../events/paymentattempt-failed.event';
import {
  CreatePaymentAttemptCommand,
  UpdatePaymentAttemptCommand,
  DeletePaymentAttemptCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PaymentAttemptCrudSaga {
  private readonly logger = new Logger(PaymentAttemptCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPaymentAttemptCreated = ($events: Observable<PaymentAttemptCreatedEvent>) => {
    return $events.pipe(
      ofType(PaymentAttemptCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de PaymentAttempt: ${event.aggregateId}`);
        void this.handlePaymentAttemptCreated(event);
      }),
      map(() => null),
      map(event => {
        // Ejecutar comandos adicionales si es necesario
        return null;
      })
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPaymentAttemptUpdated = ($events: Observable<PaymentAttemptUpdatedEvent>) => {
    return $events.pipe(
      ofType(PaymentAttemptUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de PaymentAttempt: ${event.aggregateId}`);
        void this.handlePaymentAttemptUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPaymentAttemptDeleted = ($events: Observable<PaymentAttemptDeletedEvent>) => {
    return $events.pipe(
      ofType(PaymentAttemptDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de PaymentAttempt: ${event.aggregateId}`);
        void this.handlePaymentAttemptDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };

  @Saga()
  onPaymentFailed = ($events: Observable<PaymentFailedEvent>) => {
    return $events.pipe(
      ofType(PaymentFailedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PaymentFailed: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentAttemptCrudSaga.name)
      .get(PaymentAttemptCrudSaga.name),
  })
  private async handlePaymentAttemptCreated(event: PaymentAttemptCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentAttempt Created completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentAttemptCrudSaga.name)
      .get(PaymentAttemptCrudSaga.name),
  })
  private async handlePaymentAttemptUpdated(event: PaymentAttemptUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentAttempt Updated completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PaymentAttemptCrudSaga.name)
      .get(PaymentAttemptCrudSaga.name),
  })
  private async handlePaymentAttemptDeleted(event: PaymentAttemptDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentAttempt Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPaymentAttemptFailedEvent( error,event));
  }
}
