/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 *
 * NomencladorListenersModule — registra los listeners on<Nomenclador>Change
 * para todos los nomencladores referenciados por las entidades de este
 * microservicio. Se importa una sola vez desde app.module.ts.
 *
 * Generado por sources/scaffold_nomenclador_listeners.py — NO editar a mano.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { OnCardNetworkChangeListener } from './on-card-network-change.listener';
import { OnCurrencyCodeChangeListener } from './on-currency-code-change.listener';
import { OnCustomerOnboardingStatusChangeListener } from './on-customer-onboarding-status-change.listener';
import { OnPaymentAttemptStatusChangeListener } from './on-payment-attempt-status-change.listener';
import { OnPaymentMerchantGatewayEligibilityStatusChangeListener } from './on-payment-merchant-gateway-eligibility-status-change.listener';
import { OnPaymentMethodTypeChangeListener } from './on-payment-method-type-change.listener';
import { OnPaymentStatusChangeListener } from './on-payment-status-change.listener';
import { OnSettlementModeChangeListener } from './on-settlement-mode-change.listener';

@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [
    OnCardNetworkChangeListener,
    OnCurrencyCodeChangeListener,
    OnCustomerOnboardingStatusChangeListener,
    OnPaymentAttemptStatusChangeListener,
    OnPaymentMerchantGatewayEligibilityStatusChangeListener,
    OnPaymentMethodTypeChangeListener,
    OnPaymentStatusChangeListener,
    OnSettlementModeChangeListener,
  ],
  exports: [
    OnCardNetworkChangeListener,
    OnCurrencyCodeChangeListener,
    OnCustomerOnboardingStatusChangeListener,
    OnPaymentAttemptStatusChangeListener,
    OnPaymentMerchantGatewayEligibilityStatusChangeListener,
    OnPaymentMethodTypeChangeListener,
    OnPaymentStatusChangeListener,
    OnSettlementModeChangeListener,
  ],
})
export class NomencladorListenersModule {}
