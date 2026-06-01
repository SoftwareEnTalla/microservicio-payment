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
  PaymentCreatedEvent,
  PaymentUpdatedEvent,
  PaymentDeletedEvent,
  PaymentSucceededEvent,
} from '../events/exporting.event';
import {
  SagaPaymentFailedEvent
} from '../events/payment-failed.event';
import {
  CreatePaymentCommand,
  UpdatePaymentCommand,
  DeletePaymentCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';
import { getCurrentAuthorizationHeader } from 'src/common/logger/request-trace-context';

@Injectable()
export class PaymentCrudSaga {
  private readonly logger = new Logger(PaymentCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPaymentCreated = ($events: Observable<PaymentCreatedEvent>) => {
    return $events.pipe(
      ofType(PaymentCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Payment: ${event.aggregateId}`);
        void this.handlePaymentCreated(event);
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
  onPaymentUpdated = ($events: Observable<PaymentUpdatedEvent>) => {
    return $events.pipe(
      ofType(PaymentUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Payment: ${event.aggregateId}`);
        void this.handlePaymentUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPaymentDeleted = ($events: Observable<PaymentDeletedEvent>) => {
    return $events.pipe(
      ofType(PaymentDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Payment: ${event.aggregateId}`);
        void this.handlePaymentDeleted(event);
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
  onPaymentSucceeded = ($events: Observable<PaymentSucceededEvent>) => {
    return $events.pipe(
      ofType(PaymentSucceededEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PaymentSucceeded: ${event.aggregateId}`);
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
      .registerClient(PaymentCrudSaga.name)
      .get(PaymentCrudSaga.name),
  })
  private async handlePaymentCreated(event: PaymentCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Payment Created completada: ${event.aggregateId}`);
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
      .registerClient(PaymentCrudSaga.name)
      .get(PaymentCrudSaga.name),
  })
  private async handlePaymentUpdated(event: PaymentUpdatedEvent): Promise<void> {
    try {
      await this.syncInventoryReservation(event);
      this.logger.log(`Saga Payment Updated completada: ${event.aggregateId}`);
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
      .registerClient(PaymentCrudSaga.name)
      .get(PaymentCrudSaga.name),
  })
  private async handlePaymentDeleted(event: PaymentDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Payment Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPaymentFailedEvent( error,event));
  }

  private async syncInventoryReservation(event: PaymentUpdatedEvent): Promise<void> {
    const snapshot = this.extractSnapshot(event);
    const paymentId = String(snapshot?.id ?? event.aggregateId ?? '').trim();
    const orderId = String(snapshot?.orderId ?? '').trim();
    const paymentStatus = String(snapshot?.status ?? '').trim().toUpperCase();

    if (!paymentId || !orderId || !paymentStatus) {
      return;
    }

    if (!['SUCCEEDED', 'AUTHORIZED', 'CAPTURED', 'SETTLED', 'FAILED', 'REJECTED', 'CANCELLED', 'VOIDED', 'REFUNDED', 'CHARGEBACK'].includes(paymentStatus)) {
      return;
    }

    const ordersApiBaseUrl = (process.env.ORDERS_API_BASE_URL || 'http://host.docker.internal:3003/api').replace(/\/$/, '');
    const authorizationHeader = this.resolveOrdersAuthorizationHeader();
    const response = await fetch(`${ordersApiBaseUrl}/orders-lifecycle/stock/payment/${paymentId}/sync`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
      body: JSON.stringify({
        paymentStatus,
        reason: `payment-status:${paymentStatus}`,
      }),
    });

    const responseBody = await this.safeReadJson(response);
    if (!response.ok) {
      throw new Error(`Orders rechazó la sincronización de stock para payment ${paymentId} con estado ${response.status}: ${JSON.stringify(responseBody)}`);
    }

    this.logger.log(`Saga Payment sincronizó stock con Orders para ${paymentId} en estado ${paymentStatus}`);
  }

  private extractSnapshot(event: PaymentUpdatedEvent): Record<string, any> {
    return (event as any)?.payload?.instance || {};
  }

  private resolveOrdersAuthorizationHeader(): string | undefined {
    const requestAuthorizationHeader = getCurrentAuthorizationHeader();
    if (requestAuthorizationHeader) {
      return requestAuthorizationHeader;
    }

    const internalServiceToken = String(process.env.INTERNAL_SERVICE_AUTH_TOKEN || '').trim();
    if (!internalServiceToken) {
      return undefined;
    }

    return internalServiceToken.toLowerCase().startsWith('bearer ')
      ? internalServiceToken
      : `Bearer ${internalServiceToken}`;
  }

  private async safeReadJson(response: Response): Promise<Record<string, any> | null> {
    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text) as Record<string, any>;
    } catch {
      return { raw: text };
    }
  }
}
