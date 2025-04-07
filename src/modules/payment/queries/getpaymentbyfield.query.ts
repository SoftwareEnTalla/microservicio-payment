import { BaseQuery } from './base.query';

export class GetPaymentByFieldQuery extends BaseQuery {
  constructor(
    public readonly filters: Record<string, any>,
    metadata?: Record<string, any>
  ) {
    super(metadata);
  }
}
