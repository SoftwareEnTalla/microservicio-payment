/*
 * Copyright (c) 2025 SoftwarEnTalla
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


import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePaymentCommand } from "../createpayment.command";
import { KafkaEventPublisher } from "../../shared/adapters/kafka-event-publisher";
import { KafkaEventSubscriber } from "../../shared/adapters/kafka-event-subscriber";
import { EventStoreService } from "../../shared/event-store/event-store.service";
import { PaymentCreatedEvent } from "../../events/paymentcreated.event";
import { v4 as uuidv4 } from "uuid";

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventSubscriber: KafkaEventSubscriber,
    private readonly eventStore: EventStoreService
  ) {}
  async execute(command: CreatePaymentCommand) {
    command.id = command.id || uuidv4(); // Generar ID si no existe
    // Implementar lógica del comando
    const event = new PaymentCreatedEvent(command.id, command.metadata || command.metadata || {
        instance: {},
        metadata: {
          initiatedBy: 'system',
          correlationId: command.id,
        },
      });

    // 1. Persistir en event store
    await this.eventStore.appendEvent("payment", event);

    // 2. Publicar a Kafka (y por tanto a otros microservicios)
    await this.eventPublisher.publish(event);

    return event;
  }
}
