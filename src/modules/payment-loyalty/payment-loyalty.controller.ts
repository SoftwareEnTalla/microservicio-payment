import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaymentLoyaltyService } from './payment-loyalty.service';

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
}