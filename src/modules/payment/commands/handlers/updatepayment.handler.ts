import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePaymentCommand } from '../updatepayment.command';

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler implements ICommandHandler<UpdatePaymentCommand> {
  async execute(command: UpdatePaymentCommand) {
    // Implementar lógica del comando
  }
}
