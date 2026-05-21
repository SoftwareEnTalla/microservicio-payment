import { SetMetadata } from '@nestjs/common';

export interface FinancialActionMetadata {
  policyCode: string;
  actionType: string;
  targetType: string;
  requiredPermissions: string[];
}

export const FINANCIAL_ACTION_KEY = 'financial_action_metadata';

export function FinancialAction(metadata: FinancialActionMetadata): MethodDecorator {
  return SetMetadata(FINANCIAL_ACTION_KEY, metadata);
}