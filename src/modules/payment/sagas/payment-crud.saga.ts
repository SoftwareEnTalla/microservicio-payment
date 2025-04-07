import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, filter, map, tap } from 'rxjs';
import {
  PaymentCreatedEvent,
  PaymentUpdatedEvent,
  PaymentDeletedEvent
} from '../events/exporting.event';
import {
  SagaPaymentFailedEvent
} from '../events/payment-failed.event';
import {
  CreatePaymentCommand,
  UpdatePaymentCommand,
  DeletePaymentCommand
} from '../commands/exporting.command';

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
        // Lógica post-creación (ej: enviar notificación)
      }),
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
        // Lógica post-actualización (ej: actualizar caché)
      })
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPaymentDeleted = ($events: Observable<PaymentDeletedEvent>) => {
    return $events.pipe(
      ofType(PaymentDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Payment: ${event.aggregateId}`);
        // Lógica post-eliminación (ej: limpiar relaciones)
      }),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPaymentFailedEvent( error,event));
  }
}
