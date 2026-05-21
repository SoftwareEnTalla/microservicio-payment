import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { FINANCIAL_ACTION_KEY, FinancialActionMetadata } from './financial-action.decorator';
import { SecurityAuditBridgeService } from './security-audit-bridge.service';
import { SecurityIdentityBridgeService } from './security-identity-bridge.service';

const PRIVILEGED_ROLE_TOKENS = ['admin', 'system', 'superadmin', 'root'];

@Injectable()
export class FinancialActionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditBridge: SecurityAuditBridgeService,
    private readonly identityBridge: SecurityIdentityBridgeService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<FinancialActionMetadata | undefined>(
      FINANCIAL_ACTION_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: Record<string, unknown> }>();
    const actor = request.user || {};
    const actorId = String(actor.sub || 'unknown-actor');
    const actorRole = this.normalizeToken(String(actor.role || ''));
    const permissions = Array.isArray(actor.permissions)
      ? actor.permissions.map((permission) => this.normalizeToken(String(permission)))
      : [];
    const jwtSecurity = actor.security && typeof actor.security === 'object' ? actor.security as Record<string, unknown> : {};
    const security = await this.identityBridge.getUserSecurityState(actorId, request.headers.authorization) || jwtSecurity;
    const freeze = security.freeze && typeof security.freeze === 'object' ? security.freeze as Record<string, unknown> : null;
    const freezeStatus = this.normalizeToken(String((freeze?.status as string | undefined) || security.freezeStatus || 'ACTIVE'));
    const freezeScope = Array.isArray(freeze?.scope) ? freeze.scope : [];
    const scope = (freezeScope.length ? freezeScope : Array.isArray(security.scope) ? security.scope : [])
      .map((item) => this.normalizeToken(String(item)));
    const temporaryLockUntil = security.temporaryLockUntil ? new Date(String(security.temporaryLockUntil)) : null;
    const targetId = String((request.params as Record<string, string> | undefined)?.payoutRequestId || (request.params as Record<string, string> | undefined)?.paymentId || '');
    const privileged = PRIVILEGED_ROLE_TOKENS.some((token) => actorRole.includes(token));
    const allowed = privileged || metadata.requiredPermissions.some((token) => {
      const normalized = this.normalizeToken(token);
      return permissions.some((permission) => permission.includes(normalized));
    });

    if (freezeStatus === 'frozen' && scope.includes('financialactions')) {
      await this.auditBridge.record({
        authorizationHeader: request.headers.authorization,
        actorId,
        policyCode: metadata.policyCode,
        actionType: metadata.actionType,
        targetType: metadata.targetType,
        targetId,
        decision: 'DENIED',
        reason: 'Cuenta congelada para acciones financieras.',
        metadata: { route: request.originalUrl || request.url, freezeStatus, scope },
      });
      throw new ForbiddenException('La cuenta está congelada para acciones financieras.');
    }

    if (temporaryLockUntil && !Number.isNaN(temporaryLockUntil.getTime()) && temporaryLockUntil.getTime() > Date.now()) {
      await this.auditBridge.record({
        authorizationHeader: request.headers.authorization,
        actorId,
        policyCode: metadata.policyCode,
        actionType: metadata.actionType,
        targetType: metadata.targetType,
        targetId,
        decision: 'DENIED',
        reason: 'Cuenta bloqueada temporalmente por antifraude.',
        metadata: { route: request.originalUrl || request.url, temporaryLockUntil: temporaryLockUntil.toISOString() },
      });
      throw new ForbiddenException('La cuenta se encuentra bloqueada temporalmente para acciones financieras.');
    }

    if (!allowed) {
      await this.auditBridge.record({
        authorizationHeader: request.headers.authorization,
        actorId,
        policyCode: metadata.policyCode,
        actionType: metadata.actionType,
        targetType: metadata.targetType,
        targetId,
        decision: 'DENIED',
        reason: 'ACL insuficiente para la acción financiera requerida.',
        metadata: {
          route: request.originalUrl || request.url,
          actorRole,
          requiredPermissions: metadata.requiredPermissions,
          permissions,
        },
      });
      throw new ForbiddenException('No tiene permisos para ejecutar esta acción financiera.');
    }

    await this.auditBridge.record({
      authorizationHeader: request.headers.authorization,
      actorId,
      policyCode: metadata.policyCode,
      actionType: metadata.actionType,
      targetType: metadata.targetType,
      targetId,
      decision: 'ALLOWED',
      reason: 'Acción financiera autorizada.',
      metadata: {
        route: request.originalUrl || request.url,
        actorRole,
        matchedPermissions: metadata.requiredPermissions,
      },
    });

    return true;
  }

  private normalizeToken(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }
}