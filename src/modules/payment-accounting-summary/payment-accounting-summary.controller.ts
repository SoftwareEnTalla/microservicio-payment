import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PaymentAccountingSummaryService } from './payment-accounting-summary.service';

@ApiTags('payment-accounting')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('payment-accounting')
export class PaymentAccountingSummaryController {
  constructor(private readonly service: PaymentAccountingSummaryService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen táctico del accounting comercial de payment' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico del accounting de payment.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 6));
  }
}