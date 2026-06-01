# FEDERATED PAYMENT PLATFORM — Mapeo y Plan de Homologación

Objetivo: homologar la propuesta de "Federated Payment Orchestration Platform" (ver `payment.md`) con la implementación actual en `payment-service`, manteniendo la arquitectura existente y convirtiendo los "nuevos microservicios" sugeridos en módulos del servicio actual.

## Resumen ejecutivo
- `payment-service` ya implementa la mayor parte de los componentes necesarios (módulos `payment`, `provider-type`, `card-network`, `payment-merchant-gateway-eligibility`, `payment-loyalty`, token/DTOs, integración Kafka, event-store, webhooks y sagas).
- Recomendación: consolidar la plataforma como una **Federated Payment Orchestrator** monolítica modular (un único repositorio/servicio con módulos cohesionados), en lugar de múltiples microservicios separados. Cada elemento propuesto en `payment.md` será un módulo dentro de `payment-service`.

## Mapeo propuesto (Propuesta ↔ Implementación actual)
- Payment Orchestrator: `src/modules/payment` (controllers, services, command/query, sagas).
- Provider Registry: `src/modules/provider-type` (entities, controllers, services).
- Provider Adapter Layer: investigar y estandarizar adaptadores bajo `src/modules/payment/adapters` o `src/modules/provider-type/adapters` (actualmente hay `shared/adapters/kafka-event-publisher` y suscriptores; falta un `provider adapter` genérico para gateways externos).
- Token Vault: `src/modules/payment` currently stores `payment_methods` and token-like structures (revisar `payment-methods` entities — `payment-methods` tables). Si es necesario, crear `src/modules/token-vault` que envuelva el storage (no almacenar PAN/CVV).
- Webhook Engine: actualmente se manejan eventos y sagas (`sagas/*`, `events/*`) y adaptadores Kafka para eventos; recomendable extraer normalización en `src/modules/webhooks`.
- Reconciliation Engine: no hay módulo explícito; sugerir `src/modules/reconciliation` y reusar `shared/event-store` para comparar estados.
- Routing Engine: `payment-merchant-gateway-eligibility` y `payment-merchant-gateway-eligibility/services` ya contienen lógica de elegibilidad; extender a `routing` con prioridad y costos.

## Archivos y módulos a reutilizar (puntos concretos)
- `src/modules/payment/*` — núcleo de la orquestación y lifecycle.
- `src/modules/provider-type/*` — metadata y registry.
- `src/modules/card-network/*` — mapea a `provider adapters` para redes de tarjeta.
- `src/modules/payment/shared/messaging/*` — reusar para event-driven flows.
- `src/modules/payment/sagas/*` — integrar con webhook engine y reconciliation.

## Cambios mínimos recomendados para homologar
1. Crear carpeta `src/modules/orchestrator` (o `src/modules/payment-orchestrator`) que ofrezca:
   - `routing.service.ts` (routing engine)
   - `orchestrator.service.ts` (entrada única para `POST /api/payments` que normaliza y encola acciones)
2. Mover/crear `src/modules/provider-adapters/*` con adaptadores concretos (Stripe, PayPal, TropiPay, CubaPay).
3. Añadir `src/modules/token-vault` con una API clara y encriptación de tokens.
4. Crear `src/modules/webhook-engine` que normalice y haga idempotencia de callbacks.
5. Documentar `Idempotency-Key` y exponer en `paymentcommand.controller`.

## Estrategia de conversión (pasos)
1. Analizar dependencias actuales y cobertura de tests en `payment-service`.
2. Crear los módulos vacíos (`orchestrator`, `provider-adapters`, `token-vault`, `webhook-engine`, `reconciliation`) con interfaces públicas.
3. Refactor ligero: redirigir llamadas existentes a las new-facade services dentro del mismo proceso (manteniendo endpoints y DB schema).
4. Implementar adaptadores uno a uno (ej. Stripe adapter) y testear integration con provider mocks.
5. Habilitar feature flags para routing inteligente y fallback.

## Riesgos y mitigaciones
- Riesgo: cambios en contrato de DB/Events. Mitigación: mantener backwards compatibility y migraciones con scripts.
- Riesgo: seguridad y PCI. Mitigación: no almacenar PAN; usar token vault con KMS/HSM; auditar endpoints de pago.

## Siguientes pasos propuestos (rápidos)
- Crear los módulos base en `payment-service` y un `README` para cada módulo explicando responsabilidades.
- Implementar `orchestrator.service.ts` con una API que acepte `PaymentRequest` y devuelva `transaction_id`.
- Añadir tests unitarios y de integración para el workflow básico (create → authorize → capture).

---
Generado automáticamente: $(date)
