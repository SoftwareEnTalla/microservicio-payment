import { Injectable } from '@nestjs/common';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { BaseEvent } from '../../events/base.event';

@Injectable()
export class EventStoreService {
  private payment: EventStoreDBClient;

  constructor() {
    this.payment = EventStoreDBClient.connectionString(
      'esdb://localhost:2113?tls=false'
    );
  }

  async appendEvent(stream: string, event: BaseEvent) {
    await this.payment.appendToStream(
      stream,
      jsonEvent({
        type: event.constructor.name,
        data: JSON.parse(JSON.stringify(event)),
      })
    );
  }

  async readEvents(stream: string) {
    return this.payment.readStream(stream);
  }
}
