import { Injectable, Logger } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

export interface SecurityAuditEntry {
  authorizationHeader?: string;
  actorId: string;
  policyCode: string;
  actionType: string;
  targetType: string;
  targetId?: string;
  decision: 'ALLOWED' | 'DENIED';
  reason: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class SecurityAuditBridgeService {
  private readonly logger = new Logger(SecurityAuditBridgeService.name);

  async record(entry: SecurityAuditEntry): Promise<void> {
    const url = new URL(`${this.resolveSecurityBaseUrl()}/systemadminpolicys/command`);
    const body = JSON.stringify({
      name: `${entry.actionType}-${entry.decision}`.slice(0, 100),
      description: entry.reason,
      adminUserId: entry.actorId,
      policyCode: entry.policyCode,
      actionType: entry.actionType,
      targetType: entry.targetType,
      targetId: entry.targetId || '',
      decision: entry.decision,
      reason: entry.reason,
      occurredAt: new Date().toISOString(),
      metadata: {
        service: 'payment-service',
        domain: 'financial-actions',
        ...entry.metadata,
      },
    });

    await new Promise<void>((resolve) => {
      const transport = url.protocol === 'https:' ? https : http;
      const request = transport.request(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: `${url.pathname}${url.search}`,
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body),
            ...(entry.authorizationHeader ? { authorization: entry.authorizationHeader } : {}),
          },
          timeout: 5000,
        },
        (response) => {
          response.on('data', () => undefined);
          response.on('end', () => resolve());
        },
      );

      request.on('error', (error) => {
        this.logger.warn(`No se pudo registrar auditoría financiera: ${error.message}`);
        resolve();
      });

      request.on('timeout', () => {
        request.destroy();
        this.logger.warn('Timeout al registrar auditoría financiera en security-service');
        resolve();
      });

      request.write(body);
      request.end();
    });
  }

  private resolveSecurityBaseUrl(): string {
    return String(process.env.SECURITY_SERVICE_URL || 'http://security-service-app-1:3015/api').replace(/\/$/, '');
  }
}