import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookEngineService {
  private readonly logger = new Logger(WebhookEngineService.name);

  async handleProviderWebhook(provider: string, payload: any) {
    this.logger.debug(`handleProviderWebhook from ${provider}`);
    // Validate signature, normalize event, emit internal event
    return { ok: true };
  }
}
