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


import { BaseEvent } from './base.event';
import { PaymentCreatedEvent } from './paymentcreated.event';
import { PaymentUpdatedEvent } from './paymentupdated.event';
import { PaymentDeletedEvent } from './paymentdeleted.event';
import { PaymentSucceededEvent } from './paymentsucceeded.event';
import { CustomerGatewayOnboardingStartedEvent } from './customergatewayonboardingstarted.event';
import { CustomerGatewayOnboardingApprovedEvent } from './customergatewayonboardingapproved.event';
import { CustomerGatewayOnboardingRejectedEvent } from './customergatewayonboardingrejected.event';
import { CustomerGatewayOnboardingExpiredEvent } from './customergatewayonboardingexpired.event';
import { RefundRequestedEvent } from './refundrequested.event';
import { ReturnRestockedEvent } from './returnrestocked.event';

export type RegisteredEventClass<T extends BaseEvent = BaseEvent> = new (
  aggregateId: string,
  payload: any
) => T;

export interface RegisteredEventDefinition<T extends BaseEvent = BaseEvent> {
  topic: string;
  eventName: string;
  version: string;
  eventClass: RegisteredEventClass<T>;
  retryTopic: string;
  dlqTopic: string;
  maxRetries: number;
  replayable: boolean;
}

const createEventDefinition = <T extends BaseEvent>(
  topic: string,
  eventClass: RegisteredEventClass<T>,
  overrides?: Partial<Omit<RegisteredEventDefinition<T>, 'topic' | 'eventName' | 'eventClass'>>,
): RegisteredEventDefinition<T> => ({
  topic,
  eventName: eventClass.name,
  version: overrides?.version ?? '1.0.0',
  eventClass,
  retryTopic: overrides?.retryTopic ?? topic + '-retry',
  dlqTopic: overrides?.dlqTopic ?? topic + '-dlq',
  maxRetries: overrides?.maxRetries ?? 3,
  replayable: overrides?.replayable ?? true,
});

const EVENT_DEFINITION_OVERRIDES: Partial<Record<string, Partial<Omit<RegisteredEventDefinition, 'topic' | 'eventName' | 'eventClass'>>>> = {

};

export const EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'payment-created': createEventDefinition('payment-created', PaymentCreatedEvent, EVENT_DEFINITION_OVERRIDES['payment-created']),
  'payment-updated': createEventDefinition('payment-updated', PaymentUpdatedEvent, EVENT_DEFINITION_OVERRIDES['payment-updated']),
  'payment-deleted': createEventDefinition('payment-deleted', PaymentDeletedEvent, EVENT_DEFINITION_OVERRIDES['payment-deleted']),
  'payment-succeeded': createEventDefinition('payment-succeeded', PaymentSucceededEvent, EVENT_DEFINITION_OVERRIDES['payment-succeeded']),
  'customer-gateway-onboarding-started': createEventDefinition('customer-gateway-onboarding-started', CustomerGatewayOnboardingStartedEvent, EVENT_DEFINITION_OVERRIDES['customer-gateway-onboarding-started']),
  'customer-gateway-onboarding-approved': createEventDefinition('customer-gateway-onboarding-approved', CustomerGatewayOnboardingApprovedEvent, EVENT_DEFINITION_OVERRIDES['customer-gateway-onboarding-approved']),
  'customer-gateway-onboarding-rejected': createEventDefinition('customer-gateway-onboarding-rejected', CustomerGatewayOnboardingRejectedEvent, EVENT_DEFINITION_OVERRIDES['customer-gateway-onboarding-rejected']),
  'customer-gateway-onboarding-expired': createEventDefinition('customer-gateway-onboarding-expired', CustomerGatewayOnboardingExpiredEvent, EVENT_DEFINITION_OVERRIDES['customer-gateway-onboarding-expired']),
};

export const EXTERNAL_EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'refund-requested': createEventDefinition('refund-requested', RefundRequestedEvent, {
    version: '1.0.0',
    retryTopic: 'refund-requested-retry',
    dlqTopic: 'refund-requested-dlq',
    maxRetries: 5,
    replayable: true,
  }),
  'return-restocked': createEventDefinition('return-restocked', ReturnRestockedEvent, {
    version: '1.0.0',
    retryTopic: 'return-restocked-retry',
    dlqTopic: 'return-restocked-dlq',
    maxRetries: 5,
    replayable: true,
  }),
};

const ALL_EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  ...EVENT_DEFINITIONS,
  ...EXTERNAL_EVENT_DEFINITIONS,
};

export const EVENT_REGISTRY: Record<string, RegisteredEventClass> = Object.fromEntries(
  Object.values(ALL_EVENT_DEFINITIONS).map((definition) => [definition.topic, definition.eventClass])
);

export const EVENT_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.topic);
export const EVENT_RETRY_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.retryTopic);
export const EVENT_DLQ_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.dlqTopic);
export const EXTERNAL_EVENT_TOPICS = Object.values(EXTERNAL_EVENT_DEFINITIONS).map((definition) => definition.topic);
export const EXTERNAL_EVENT_RETRY_TOPICS = Object.values(EXTERNAL_EVENT_DEFINITIONS).map((definition) => definition.retryTopic);
export const EXTERNAL_EVENT_DLQ_TOPICS = Object.values(EXTERNAL_EVENT_DEFINITIONS).map((definition) => definition.dlqTopic);
export const EVENT_CONSUMER_TOPICS = Array.from(new Set([
  ...EVENT_TOPICS,
  ...EVENT_RETRY_TOPICS,
  ...EXTERNAL_EVENT_TOPICS,
  ...EXTERNAL_EVENT_RETRY_TOPICS,
]));
export const EVENT_ADMIN_TOPICS = Array.from(new Set([
  ...EVENT_TOPICS,
  ...EVENT_RETRY_TOPICS,
  ...EVENT_DLQ_TOPICS,
  ...EXTERNAL_EVENT_RETRY_TOPICS,
  ...EXTERNAL_EVENT_DLQ_TOPICS,
]));

export const resolveEventDefinition = (candidate?: string): RegisteredEventDefinition | undefined => {
  if (!candidate) {
    return undefined;
  }

  if (ALL_EVENT_DEFINITIONS[candidate]) {
    return ALL_EVENT_DEFINITIONS[candidate];
  }

  return Object.values(ALL_EVENT_DEFINITIONS).find(
    (definition) =>
      definition.topic === candidate ||
      definition.retryTopic === candidate ||
      definition.dlqTopic === candidate ||
      definition.eventName === candidate,
  );
};
