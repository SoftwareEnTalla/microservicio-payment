import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePaymentCommand } from '../deletepayment.command';

@CommandHandler(DeletePaymentCommand)
export class DeletePaymentHandler implements ICommandHandler<DeletePaymentCommand> {
  async execute(command: DeletePaymentCommand) {
    // Implementar lógica del comando
  }
}
