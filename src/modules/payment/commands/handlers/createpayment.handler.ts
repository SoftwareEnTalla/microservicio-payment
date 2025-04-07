import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../createpayment.command';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  async execute(command: CreatePaymentCommand) {
    // Implementar lógica del comando
  }
}
