import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetPaymentByFieldQuery } from '../getpaymentbyfield.query';

@QueryHandler(GetPaymentByFieldQuery)
export class GetPaymentByFieldHandler implements IQueryHandler<GetPaymentByFieldQuery> {
  async execute(query: GetPaymentByFieldQuery) {
    // Implementar lógica de la query
  }
}
