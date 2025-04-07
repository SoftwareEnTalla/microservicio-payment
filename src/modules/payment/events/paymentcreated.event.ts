import { BaseEvent } from './base.event';

export class PaymentCreatedEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: any
  ) {
    super(aggregateId);
  }
}
