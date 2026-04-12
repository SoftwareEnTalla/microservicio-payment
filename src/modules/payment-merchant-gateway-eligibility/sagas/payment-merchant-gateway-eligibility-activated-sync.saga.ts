import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  MerchantGatewayConfigActivatedEvent,
} from '../events/exporting.event';
import {
  SagaPaymentMerchantGatewayEligibilityFailedEvent
} from '../events/paymentmerchantgatewayeligibility-failed.event';
import {
  CreatePaymentMerchantGatewayEligibilityCommand,
} from '../commands/exporting.command';

@Injectable()
export class PaymentMerchantGatewayEligibilityActivatedSyncSaga {
  private readonly logger = new Logger(PaymentMerchantGatewayEligibilityActivatedSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Materializa en payment la activación de una pasarela para un merchant sin necesidad de consulta sincrónica al bounded context merchant.

  @Saga()
  onMerchantGatewayConfigActivated = ($events: Observable<MerchantGatewayConfigActivatedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigActivatedEvent),
      tap(event => {
        this.logger.log(`Saga payment-merchant-gateway-eligibility-activated-sync recibió MerchantGatewayConfigActivated: ${event.aggregateId}`);
        void this.handleMerchantGatewayConfigActivated(event);
      }),
      map(() => null)
    );
  };

  private async handleMerchantGatewayConfigActivated(event: MerchantGatewayConfigActivatedEvent): Promise<void> {
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
      saga: 'payment-merchant-gateway-eligibility-activated-sync',
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
      status: this.resolveValue(event, 'payload.instance.status'),
      isActive: this.resolveValue(event, 'payload.instance.isActive'),
      acceptedCurrencies: this.resolveValue(event, 'payload.instance.acceptedCurrencies'),
      acceptedPaymentMethodTypes: this.resolveValue(event, 'payload.instance.acceptedPaymentMethodTypes'),
      settlementMode: this.resolveValue(event, 'payload.instance.settlementMode'),
      metadata: this.resolveValue(event, 'payload.instance.metadata'),
    };
    this.logger.log(`Ejecutando dispatch CreatePaymentMerchantGatewayEligibilityCommand para la saga executeDispatch1: ${correlationId}`);
    await this.commandBus.execute(new CreatePaymentMerchantGatewayEligibilityCommand(payload, metadata));
  }

  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga cross-context: ${error.message}`);
    this.eventBus.publish(new SagaPaymentMerchantGatewayEligibilityFailedEvent(error, event));
  }
}

