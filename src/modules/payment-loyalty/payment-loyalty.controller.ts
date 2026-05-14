import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaymentLoyaltyService } from './payment-loyalty.service';

type MultilevelReferralBeneficiaryInput = {
  beneficiaryCustomerId?: string;
  level?: number;
  referenceCode?: string;
  sharePercent?: number;
  amount?: number;
};

@ApiTags('payment-loyalty')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('payment-loyalty')
export class PaymentLoyaltyController {
  constructor(private readonly service: PaymentLoyaltyService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen táctico de wallets, cashback y referrals de payment' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico de loyalty obtenido.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 8));
  }

  @Get('wallets')
  @ApiOperation({ summary: 'Listado táctico de wallets loyalty' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Wallets loyalty obtenidos.' })
  async listWallets(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.listWallets(Number(limit || 10));
  }

  @Get('referrals/summary')
  @ApiOperation({ summary: 'Resumen táctico de referral network y comisiones por nivel' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Referral network obtenido.' })
  async getReferralSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getReferralSummary(Number(limit || 8));
  }

  @Get('referrals/multilevel-eligibility')
  @ApiOperation({ summary: 'Resumen táctico de elegibilidad multinivel por payment con referralAmount' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Elegibilidad multinivel obtenida.' })
  async getMultilevelEligibilitySummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getMultilevelEligibilitySummary(Number(limit || 8));
  }

  @Get('payouts/summary')
  @ApiOperation({ summary: 'Resumen táctico de payout requests y retiros withdrawable' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico de payouts obtenido.' })
  async getPayoutSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getPayoutSummary(Number(limit || 8));
  }

  @Get('payouts/requests')
  @ApiOperation({ summary: 'Listado táctico de payout requests' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Payout requests obtenidos.' })
  async listPayoutRequests(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.listPayoutRequests(Number(limit || 10));
  }

  @Get('wallet/:customerId')
  @ApiOperation({ summary: 'Detalle de wallet por customer' })
  @ApiParam({ name: 'customerId', type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Wallet del customer obtenido.' })
  async getWallet(
    @Param('customerId') customerId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Record<string, unknown>> {
    return this.service.getWallet(customerId, limit ?? 10);
  }

  @Post('settlement/cashback/payment/:paymentId')
  @ApiOperation({ summary: 'Acredita cashback de un payment en el wallet del customer' })
  @ApiParam({ name: 'paymentId', type: String })
  @ApiResponse({ status: 200, description: 'Cashback acreditado o ya aplicado.' })
  async settleCashback(@Param('paymentId') paymentId: string): Promise<Record<string, unknown>> {
    return this.service.settleCashback(paymentId);
  }

  @Post('settlement/referral/payment/:paymentId')
  @ApiOperation({ summary: 'Distribuye referralAmount de un payment sobre un wallet withdrawable' })
  @ApiParam({ name: 'paymentId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        beneficiaryCustomerId: { type: 'string', format: 'uuid' },
        level: { type: 'number', example: 1 },
        referenceCode: { type: 'string', example: 'REF-LEVEL-1' },
      },
      required: ['beneficiaryCustomerId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Referral distribuido o ya aplicado.' })
  async settleReferral(
    @Param('paymentId') paymentId: string,
    @Body() payload: { beneficiaryCustomerId?: string; level?: number; referenceCode?: string },
  ): Promise<Record<string, unknown>> {
    return this.service.settleReferral(paymentId, payload || {});
  }

  @Post('settlement/referral-multilevel/payment/:paymentId')
  @ApiOperation({ summary: 'Distribuye referralAmount de un payment en múltiples niveles y residual de plataforma' })
  @ApiParam({ name: 'paymentId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        beneficiaries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              beneficiaryCustomerId: { type: 'string', format: 'uuid' },
              level: { type: 'number', example: 1 },
              referenceCode: { type: 'string', example: 'REF-L1' },
              sharePercent: { type: 'number', example: 60 },
              amount: { type: 'number', example: 6 },
            },
            required: ['beneficiaryCustomerId', 'level'],
          },
        },
        platformResidualCustomerId: { type: 'string', format: 'uuid' },
        platformReferenceCode: { type: 'string', example: 'PLATFORM-RESIDUAL' },
      },
      required: ['beneficiaries'],
    },
  })
  @ApiResponse({ status: 200, description: 'Referral multinivel distribuido con éxito.' })
  async settleReferralMultilevel(
    @Param('paymentId') paymentId: string,
    @Body()
    payload: {
      beneficiaries?: MultilevelReferralBeneficiaryInput[];
      platformResidualCustomerId?: string;
      platformReferenceCode?: string;
    },
  ): Promise<Record<string, unknown>> {
    return this.service.settleReferralMultilevel(paymentId, payload || {});
  }

  @Post('payouts/request')
  @ApiOperation({ summary: 'Crea un payout request debitando saldo withdrawable del wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', format: 'uuid' },
        merchantId: { type: 'string', format: 'uuid' },
        amount: { type: 'number', example: 25.5 },
        currencyCode: { type: 'string', example: 'USD' },
        preferredCollectionMethod: { type: 'string', example: 'BANK_TRANSFER' },
        notes: { type: 'string', example: 'Primer retiro loyalty' },
        paymentId: { type: 'string', format: 'uuid' },
        orderId: { type: 'string', format: 'uuid' },
      },
      required: ['customerId', 'merchantId', 'amount'],
    },
  })
  @ApiResponse({ status: 200, description: 'Payout request creado con éxito.' })
  async createPayoutRequest(
    @Body()
    payload: {
      customerId?: string;
      merchantId?: string;
      amount?: number;
      currencyCode?: string;
      preferredCollectionMethod?: string;
      notes?: string;
      paymentId?: string;
      orderId?: string;
    },
  ): Promise<Record<string, unknown>> {
    return this.service.createPayoutRequest(payload || {});
  }

  @Post('payouts/request/:payoutRequestId/approve')
  @ApiOperation({ summary: 'Aprueba un payout request y fija deuda aplicada al merchant' })
  @ApiParam({ name: 'payoutRequestId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        note: { type: 'string', example: 'Aprobado por operaciones' },
        merchantDebtAmount: { type: 'number', example: 2.5 },
        invoiceId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Payout request aprobado.' })
  async approvePayoutRequest(
    @Param('payoutRequestId') payoutRequestId: string,
    @Body() payload: { note?: string; merchantDebtAmount?: number; invoiceId?: string },
  ): Promise<Record<string, unknown>> {
    return this.service.approvePayoutRequest(payoutRequestId, payload || {});
  }

  @Post('payouts/request/:payoutRequestId/reject')
  @ApiOperation({ summary: 'Rechaza un payout request y devuelve el saldo withdrawable al wallet' })
  @ApiParam({ name: 'payoutRequestId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', example: 'Cuenta de cobro inválida' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Payout request rechazado y revertido.' })
  async rejectPayoutRequest(
    @Param('payoutRequestId') payoutRequestId: string,
    @Body() payload: { reason?: string },
  ): Promise<Record<string, unknown>> {
    return this.service.rejectPayoutRequest(payoutRequestId, payload || {});
  }

  @Post('payouts/request/:payoutRequestId/settle')
  @ApiOperation({ summary: 'Liquida un payout request y registra deuda aplicada y referencia de settlement' })
  @ApiParam({ name: 'payoutRequestId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        merchantDebtAmount: { type: 'number', example: 1.5 },
        settlementReference: { type: 'string', example: 'SETTLEMENT-2026-0001' },
        note: { type: 'string', example: 'Liquidado en batch diario' },
        invoiceId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Payout request liquidado.' })
  async settlePayoutRequest(
    @Param('payoutRequestId') payoutRequestId: string,
    @Body() payload: { merchantDebtAmount?: number; settlementReference?: string; note?: string; invoiceId?: string },
  ): Promise<Record<string, unknown>> {
    return this.service.settlePayoutRequest(payoutRequestId, payload || {});
  }
}