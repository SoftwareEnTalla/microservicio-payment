import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  async createPayment(payload: any) {
    this.logger.debug('Received createPayment payload');
    // Placeholder: validate and route to provider
    return { ok: true, id: 'placeholder-id' };
  }
}
