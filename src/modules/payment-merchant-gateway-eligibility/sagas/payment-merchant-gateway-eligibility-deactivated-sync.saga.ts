import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  MerchantGatewayConfigDeactivatedEvent,
} from '../events/exporting.event';
import {
  SagaPaymentMerchantGatewayEligibilityFailedEvent
} from '../events/paymentmerchantgatewayeligibility-failed.event';
import {
  UpdatePaymentMerchantGatewayEligibilityCommand,
} from '../commands/exporting.command';

@Injectable()
export class PaymentMerchantGatewayEligibilityDeactivatedSyncSaga {
  private readonly logger = new Logger(PaymentMerchantGatewayEligibilityDeactivatedSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Desactiva localmente la elegibilidad de una pasarela para impedir nuevos pagos sobre merchants que la han pausado o suspendido.

  @Saga()
  onMerchantGatewayConfigDeactivated = ($events: Observable<MerchantGatewayConfigDeactivatedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigDeactivatedEvent),
      tap(event => {
        this.logger.log(`Saga payment-merchant-gateway-eligibility-deactivated-sync recibió MerchantGatewayConfigDeactivated: ${event.aggregateId}`);
        void this.handleMerchantGatewayConfigDeactivated(event);
      }),
      map(() => null)
    );
  };

  private async handleMerchantGatewayConfigDeactivated(event: MerchantGatewayConfigDeactivatedEvent): Promise<void> {
    const correlationId = this.resolveCorrelationId(event);
    try {
      await this.executeDispatch1(event, correlationId);
    } catch (error: any) {
      await this.runCompensations(event, correlationId, error);
      this.handleSagaError(error, event);
    }
  }

  private resolveCorrelationId(event: any): string {
    const correlationCandidate = this.resolveValue(event, 'aggregateId');
    if (correlationCandidate !== undefined && correlationCandidate !== null && String(correlationCandidate).trim() !== '') {
      return String(correlationCandidate);
    }
    return String(event?.payload?.metadata?.correlationId ?? event?.aggregateId ?? 'unknown-correlation');
  }

  private buildCommandMetadata(event: any, correlationId: string) {
    const sourceMetadata = event?.payload?.metadata ?? {};
    return {
      ...sourceMetadata,
      correlationId,
      causationId: sourceMetadata?.eventId ?? sourceMetadata?.correlationId ?? event?.aggregateId,
      saga: 'payment-merchant-gateway-eligibility-deactivated-sync',
    };
  }

  private resolveEventInstance(event: any): any {
    return event?.payload?.instance ?? {};
  }

  private resolveValue(event: any, path: string): any {
    const normalizedPath = String(path || '').replace(/^event\./, '');
    if (!normalizedPath) {
      return undefined;
    }
    if (normalizedPath === '$now') {
      return new Date().toISOString();
    }
    return normalizedPath.split('.').reduce((acc: any, segment: string) => (acc === undefined || acc === null ? undefined : acc[segment]), event);
  }

  private async runCompensations(event: any, correlationId: string, error: Error): Promise<void> {
    this.logger.warn(`Ejecutando compensaciones de saga para ${correlationId}: ${error.message}`);
  }

  private async executeDispatch1(event: any, correlationId: string): Promise<void> {
    const metadata = this.buildCommandMetadata(event, correlationId);
    const payload = {
      id: this.resolveValue(event, 'aggregateId'),
      merchantGatewayConfigId: this.resolveValue(event, 'aggregateId'),
      merchantId: this.resolveValue(event, 'payload.instance.merchantId'),
      gatewayId: this.resolveValue(event, 'payload.instance.gatewayId'),
      metadata: this.resolveValue(event, 'payload.instance.metadata'),
      status: 'SUSPENDED',
      isActive: false,
    };
    this.logger.log(`Ejecutando dispatch UpdatePaymentMerchantGatewayEligibilityCommand para la saga executeDispatch1: ${correlationId}`);
    await this.commandBus.execute(new UpdatePaymentMerchantGatewayEligibilityCommand(payload, metadata));
  }

  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga cross-context: ${error.message}`);
    this.eventBus.publish(new SagaPaymentMerchantGatewayEligibilityFailedEvent(error, event));
  }
}

