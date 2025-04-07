import { BaseQuery } from './base.query';

export class GetPaymentByIdQuery extends BaseQuery {
  constructor(
    public readonly filters: Record<string, any>,
    metadata?: Record<string, any>
  ) {
    super(metadata);
  }
}
