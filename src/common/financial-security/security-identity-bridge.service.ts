import { Injectable, Logger } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

@Injectable()
export class SecurityIdentityBridgeService {
  private readonly logger = new Logger(SecurityIdentityBridgeService.name);

  async getUserSecurityState(userId: string, authorizationHeader?: string): Promise<Record<string, unknown> | null> {
    if (!userId) {
      return null;
    }

    const url = new URL(`${this.resolveSecurityBaseUrl()}/users/query/field/id?value=${encodeURIComponent(userId)}`);

    return new Promise<Record<string, unknown> | null>((resolve) => {
      const transport = url.protocol === 'https:' ? https : http;
      const request = transport.request(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: `${url.pathname}${url.search}`,
          method: 'GET',
          headers: {
            accept: 'application/json',
            ...(authorizationHeader ? { authorization: authorizationHeader } : {}),
          },
          timeout: 5000,
        },
        (response) => {
          let raw = '';
          response.on('data', (chunk) => {
            raw += String(chunk);
          });
          response.on('end', () => {
            resolve(this.extractSecurityState(raw));
          });
        },
      );

      request.on('error', (error) => {
        this.logger.warn(`No se pudo consultar estado de identidad en security-service: ${error.message}`);
        resolve(null);
      });

      request.on('timeout', () => {
        request.destroy();
        this.logger.warn('Timeout consultando estado de identidad en security-service');
        resolve(null);
      });

      request.end();
    });
  }

  private extractSecurityState(raw: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(raw) as { data?: Array<Record<string, unknown>> } | Record<string, unknown>[];
      const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.data) ? parsed.data : [];
      const metadata = rows[0]?.metadata;
      const resolved = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      if (!resolved || typeof resolved !== 'object') {
        return null;
      }
      const security = (resolved as Record<string, unknown>).security;
      return security && typeof security === 'object' ? security as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }

  private resolveSecurityBaseUrl(): string {
    return String(process.env.SECURITY_SERVICE_URL || 'http://security-service-app-1:3015/api').replace(/\/$/, '');
  }
}