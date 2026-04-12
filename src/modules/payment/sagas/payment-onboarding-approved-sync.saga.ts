import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  CustomerGatewayOnboardingApprovedEvent,
} from '../events/exporting.event';
import {
  SagaPaymentFailedEvent
} from '../events/payment-failed.event';
import {
  UpdatePaymentCommand,
} from '../commands/exporting.command';

@Injectable()
export class PaymentOnboardingApprovedSyncSaga {
  private readonly logger = new Logger(PaymentOnboardingApprovedSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Cuando el onboarding del cliente es aprobado, el pago puede volver al estado pendiente para continuar su procesamiento normal.

  @Saga()
  onCustomerGatewayOnboardingApproved = ($events: Observable<CustomerGatewayOnboardingApprovedEvent>) => {
    return $events.pipe(
      ofType(CustomerGatewayOnboardingApprovedEvent),
      tap(event => {
        this.logger.log(`Saga payment-onboarding-approved-sync recibió CustomerGatewayOnboardingApproved: ${event.aggregateId}`);
        void this.handleCustomerGatewayOnboardingApproved(event);
      }),
      map(() => null)
    );
  };

  private async handleCustomerGatewayOnboardingApproved(event: CustomerGatewayOnboardingApprovedEvent): Promise<void> {
    const correlationId = this.resolveCorrelationId(event);
    try {
      await this.executeDispatch1(event, correlationId);
    } catch (error: any) {
      await this.runCompensations(event, correlationId, error);
      this.handleSagaError(error, event);
    }
  }

  private resolveCorrelationId(event: any): string {
    const correlationCandidate = this.resolveValue(event, 'payload.instance.externalSessionReference');
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
      saga: 'payment-onboarding-approved-sync',
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
      id: this.resolveValue(event, 'payload.instance.externalSessionReference'),
      metadata: this.resolveValue(event, 'payload.instance.metadata'),
      status: 'PENDING',
    };
    this.logger.log(`Ejecutando dispatch UpdatePaymentCommand para la saga executeDispatch1: ${correlationId}`);
    await this.commandBus.execute(new UpdatePaymentCommand(payload, metadata));
  }

  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga cross-context: ${error.message}`);
    this.eventBus.publish(new SagaPaymentFailedEvent(error, event));
  }
}

