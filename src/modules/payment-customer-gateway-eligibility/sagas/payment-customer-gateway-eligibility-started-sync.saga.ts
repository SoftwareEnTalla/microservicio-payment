import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  CustomerGatewayOnboardingStartedEvent,
} from '../events/exporting.event';
import {
  SagaPaymentCustomerGatewayEligibilityFailedEvent
} from '../events/paymentcustomergatewayeligibility-failed.event';
import {
  CreatePaymentCustomerGatewayEligibilityCommand,
} from '../commands/exporting.command';

@Injectable()
export class PaymentCustomerGatewayEligibilityStartedSyncSaga {
  private readonly logger = new Logger(PaymentCustomerGatewayEligibilityStartedSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Materializa localmente en payment el inicio o reanudación del onboarding del cliente para una pasarela concreta.

  @Saga()
  onCustomerGatewayOnboardingStarted = ($events: Observable<CustomerGatewayOnboardingStartedEvent>) => {
    return $events.pipe(
      ofType(CustomerGatewayOnboardingStartedEvent),
      tap(event => {
        this.logger.log(`Saga payment-customer-gateway-eligibility-started-sync recibió CustomerGatewayOnboardingStarted: ${event.aggregateId}`);
        void this.handleCustomerGatewayOnboardingStarted(event);
      }),
      map(() => null)
    );
  };

  private async handleCustomerGatewayOnboardingStarted(event: CustomerGatewayOnboardingStartedEvent): Promise<void> {
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
      saga: 'payment-customer-gateway-eligibility-started-sync',
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
      status: this.resolveValue(event, 'payload.instance.status'),
      requiresRevalidation: this.resolveValue(event, 'payload.instance.requiresRevalidation'),
      expiresAt: this.resolveValue(event, 'payload.instance.expiresAt'),
      externalSessionReference: this.resolveValue(event, 'payload.instance.externalSessionReference'),
      metadata: this.resolveValue(event, 'payload.instance.metadata'),
    };
    this.logger.log(`Ejecutando dispatch CreatePaymentCustomerGatewayEligibilityCommand para la saga executeDispatch1: ${correlationId}`);
    await this.commandBus.execute(new CreatePaymentCustomerGatewayEligibilityCommand(payload, metadata));
  }

  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga cross-context: ${error.message}`);
    this.eventBus.publish(new SagaPaymentCustomerGatewayEligibilityFailedEvent(error, event));
  }
}

