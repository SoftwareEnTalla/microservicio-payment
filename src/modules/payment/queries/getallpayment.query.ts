import { BaseQuery } from './base.query';

export class GetAllPaymentQuery extends BaseQuery {
  constructor(
    public readonly filters: Record<string, any>,
    metadata?: Record<string, any>
  ) {
    super(metadata);
  }
}
