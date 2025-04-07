import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetPaymentByIdQuery } from '../getpaymentbyid.query';

@QueryHandler(GetPaymentByIdQuery)
export class GetPaymentByIdHandler implements IQueryHandler<GetPaymentByIdQuery> {
  async execute(query: GetPaymentByIdQuery) {
    // Implementar lógica de la query
  }
}
