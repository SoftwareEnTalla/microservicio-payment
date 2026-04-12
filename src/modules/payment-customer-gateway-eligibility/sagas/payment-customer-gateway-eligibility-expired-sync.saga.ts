import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  CustomerGatewayOnboardingExpiredEvent,
} from '../events/exporting.event';
import {
  SagaPaymentCustomerGatewayEligibilityFailedEvent
} from '../events/paymentcustomergatewayeligibility-failed.event';
import {
  UpdatePaymentCustomerGatewayEligibilityCommand,
} from '../commands/exporting.command';

@Injectable()
export class PaymentCustomerGatewayEligibilityExpiredSyncSaga {
  private readonly logger = new Logger(PaymentCustomerGatewayEligibilityExpiredSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Marca localmente la expiración del onboarding para que payment no inicie nuevos cobros sobre una elegibilidad vencida.

  @Saga()
  onCustomerGatewayOnboardingExpired = ($events: Observable<CustomerGatewayOnboardingExpiredEvent>) => {
    return $events.pipe(
      ofType(CustomerGatewayOnboardingExpiredEvent),
      tap(event => {
        this.logger.log(`Saga payment-customer-gateway-eligibility-expired-sync recibió CustomerGatewayOnboardingExpired: ${event.aggregateId}`);
        void this.handleCustomerGatewayOnboardingExpired(event);
      }),
      map(() => null)
    );
  };

  private async handleCustomerGatewayOnboardingExpired(event: CustomerGatewayOnboardingExpiredEvent): Promise<void> {
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
      saga: 'payment-customer-gateway-eligibility-expired-sync',
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
      customerGatewayOnboardingId: this.resolveValue(event, 'aggregateId'),
      customerId: this.resolveValue(event, 'payload.instance.customerId'),
      gatewayId: this.resolveValue(event, 'payload.instance.gatewayId'),
      requiresRevalidation: this.resolveValue(event, 'payload.instance.requiresRevalidation'),
      expiresAt: this.resolveValue(event, 'payload.instance.expiresAt'),
      externalSessionReference: this.resolveValue(event, 'payload.instance.externalSessionReference'),
      metadata: this.resolveValue(event, 'payload.instance.metadata'),
      status: 'EXPIRED',
    };
    this.logger.log(`Ejecutando dispatch UpdatePaymentCustomerGatewayEligibilityCommand para la saga executeDispatch1: ${correlationId}`);
    await this.commandBus.execute(new UpdatePaymentCustomerGatewayEligibilityCommand(payload, metadata));
  }

  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga cross-context: ${error.message}`);
    this.eventBus.publish(new SagaPaymentCustomerGatewayEligibilityFailedEvent(error, event));
  }
}

