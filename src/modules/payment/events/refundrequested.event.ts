import { BaseEvent, PayloadEvent } from './base.event';

export class RefundRequestedEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: PayloadEvent<any>
  ) {
    super(aggregateId);
  }
}