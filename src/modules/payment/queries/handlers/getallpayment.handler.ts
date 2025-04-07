import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllPaymentQuery } from '../getallpayment.query';

@QueryHandler(GetAllPaymentQuery)
export class GetAllPaymentHandler implements IQueryHandler<GetAllPaymentQuery> {
  async execute(query: GetAllPaymentQuery) {
    // Implementar lógica de la query
  }
}
