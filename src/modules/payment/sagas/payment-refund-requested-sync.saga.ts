import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import { RefundRequestedEvent } from '../events/refundrequested.event';
import { ReturnRestockedEvent } from '../events/returnrestocked.event';
import { SagaPaymentFailedEvent } from '../events/payment-failed.event';
import { UpdatePaymentCommand } from '../commands/exporting.command';
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';
import { PaymentQueryRepository } from '../repositories/paymentquery.repository';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentRefundRequestedSyncSaga {
  private readonly logger = new Logger(PaymentRefundRequestedSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly paymentQueryRepository: PaymentQueryRepository,
  ) {}

  @Saga()
  onRefundRequested = ($events: Observable<RefundRequestedEvent>) => {
    return $events.pipe(
      ofType(RefundRequestedEvent),
      tap(event => {
        this.logger.log(`Saga payment-refund-requested-sync recibió RefundRequested: ${event.aggregateId}`);
        void this.handleRefundSignal(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onReturnRestocked = ($events: Observable<ReturnRestockedEvent>) => {
    return $events.pipe(
      ofType(ReturnRestockedEvent),
      tap(event => {
        this.logger.log(`Saga payment-refund-requested-sync recibió ReturnRestocked: ${event.aggregateId}`);
        void this.handleRefundSignal(event);
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
    client: LoggerClient.getInstance().registerClient(PaymentRefundRequestedSyncSaga.name).get(PaymentRefundRequestedSyncSaga.name),
  })
  private async handleRefundSignal(event: RefundRequestedEvent | ReturnRestockedEvent): Promise<void> {
    try {
      const instance = event?.payload?.instance ?? {};
      const refundStatus = String(instance?.refundStatus ?? '').trim().toUpperCase();
      const orderId = String(instance?.orderId ?? '').trim();
      if (!orderId || (event instanceof ReturnRestockedEvent && refundStatus !== 'REQUESTED')) {
        return;
      }

      const [payments] = await this.paymentQueryRepository.findAndCount({ orderId });
      if (!payments.length) {
        return;
      }

      for (const payment of payments) {
        const requestedRefundAmount = this.resolveRequestedRefundAmount(instance, payment);
        await this.commandBus.execute(
          new UpdatePaymentCommand(
            {
              id: payment.id,
              refundAmount: requestedRefundAmount > 0
                ? Number((payment as any)?.refundAmount ?? 0) + requestedRefundAmount
                : Number((payment as any)?.refundAmount ?? 0),
              accountingStatus: 'REFUND_IN_PROGRESS',
              metadata: {
                ...((payment as any)?.metadata ?? {}),
                lastRefundRequestedAt: new Date().toISOString(),
                lastRefundReturnId: event?.aggregateId,
                lastRefundOrderId: orderId,
                lastRefundShipmentId: instance?.shipmentId ?? null,
                lastRefundRequestedAmount: requestedRefundAmount,
                lastRefundStatus: instance?.refundStatus ?? null,
                lastRefundCorrelationId: event?.payload?.metadata?.correlationId ?? event?.aggregateId,
              },
            },
            this.buildCommandMetadata(event, payment),
          ),
        );
      }
    } catch (error: any) {
      this.logger.error(`Error en payment-refund-requested-sync: ${error.message}`);
      this.eventBus.publish(new SagaPaymentFailedEvent(error, event));
    }
  }

  private resolveRequestedRefundAmount(instance: any, payment: Payment): number {
    const candidate = Number(instance?.metadata?.refundAmount ?? instance?.metadata?.refundRequestedAmount ?? 0);
    if (Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }
    return 0;
  }

  private buildCommandMetadata(event: RefundRequestedEvent | ReturnRestockedEvent, payment: Payment) {
    const sourceMetadata = event?.payload?.metadata ?? {};
    return {
      instance: payment,
      metadata: {
        ...sourceMetadata,
        correlationId: sourceMetadata?.correlationId ?? event?.aggregateId,
        causationId: sourceMetadata?.eventId ?? sourceMetadata?.correlationId ?? event?.aggregateId,
        saga: 'payment-refund-requested-sync',
      },
    };
  }
}