# High-Level Architecture — Federated Payment Orchestration (adaptado a payment-service)

## Objetivo
Ofrecer una visión clara y práctica de la arquitectura a implementar dentro de `payment-service` para convertirse en una Federated Payment Orchestration Platform, manteniendo un único servicio modular (no microservicios separados).

## Vision general (texto)
Clientes (Frontend / ERP / Marketplace) → `Unified Payment API` → `Payment Orchestrator` → `Provider Registry` → `Provider Adapter Layer` → Gateways externos

## Componentes (módulos internos del mismo servicio)
- `api` (controllers): Exponer endpoints REST/GraphQL (ej. `POST /api/payments`, `GET /api/payments/:id`).
- `orchestrator`: Gateway interno que normaliza requests, valida, encola y orquesta el flujo.
- `routing`: Motor de decisión (provider selection, geo, fees, latency).
- `provider-registry`: Metadata y configuración de gateways.
- `provider-adapters`: Implementaciones concretas (Stripe, PayPal, TropiPay, CubaPay, bank-transfer adapters).
- `token-vault`: Guarda tokens y referencias (encriptadas). Interfaz para tokenizar métodos de pago.
- `webhook-engine`: Endpoint central que valida firmas, normaliza eventos y emite eventos internos.
- `reconciliation`: Jobs y procesos para conciliar pagos y settlement reports.
- `risk-engine`: Reglas de fraude y scoring (puede ser un módulo integrado o rules engine externo).
- `messaging`: Kafka/RabbitMQ adapters y manejo de idempotencia / DLQ.
- `observability`: Metrics, tracing (OpenTelemetry), audit logs.

## Interactions (sequence summary)
1. Merchant/Client calls `POST /api/payments` con `Idempotency-Key`.
2. `orchestrator` valida y persiste un `payment` en estado `CREATED`.
3. `routing` selecciona provider (registry + rules).
4. `provider-adapter` realiza `authorize`/`capture` según flow, devolviendo `provider_reference`.
5. `webhook-engine` procesa callbacks y actualiza estados (idempotent).
6. `reconciliation` periodic verifica settlement y balances.

## Storage
- PostgreSQL: tablas `payments`, `payment_attempts`, `payment_methods`, `payment_tokens`, `providers`, `refunds`, `webhook_events`.
- Token vault: cifrado con KMS/secret-store (no PAN en DB).

## Messaging
- Kafka para events (`payment.created`, `payment.succeeded`, `payment.failed`, `payment.refunded`)
- DLQ para retries y fallos críticos

## Security
- TLS everywhere
- HSM / KMS for token encryption
- Idempotency-Keys required for operations that mutan balance

## Deployment
- Mantener `payment-service` como servicio dockerizado. Dentro del contenedor ejecutar módulos; operaciones de escala a nivel del servicio (replicas) y separación lógica por módulos.

## Next steps de implementación inmediata
- Crear skeleton modules: `orchestrator`, `provider-adapters`, `token-vault`, `webhook-engine`, `reconciliation`.
- Añadir tests de contrato y de integración con un adapter mock.

---
Generado: $(date)
