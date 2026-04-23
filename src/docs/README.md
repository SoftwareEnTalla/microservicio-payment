# Payment Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3005
> **Base URL**: `http://localhost:3005/api`
> **Swagger UI**: `http://localhost:3005/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: Payment

El microservicio **payment** orquesta **el ciclo de cobro**: el pago (`Payment`), los intentos (`PaymentAttempt`), el catálogo de pasarelas (`PaymentGateway`), los datos maestros (`PaymentMasterData`) y **dos proyecciones cross-context**: `PaymentCustomerGatewayEligibility` (sincronizada desde customer) y `PaymentMerchantGatewayEligibility` (sincronizada desde merchant).

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Payment (orquestación del cobro con intentos y eventos de éxito/fallo) | payment |
| UH-2 | Payment Gateway (catálogo de pasarelas + capacidades) | payment-gateway |
| UH-3 | Payment Attempt (intentos por pago) | payment-attempt |
| UH-4 | Payment Master Data (nomencladores específicos de payments) | payment-master-data |
| UH-5 | Payment Customer Gateway Eligibility (proyección desde customer onboarding) | payment-customer-gateway-eligibility |
| UH-6 | Payment Merchant Gateway Eligibility (proyección desde merchant config) | payment-merchant-gateway-eligibility |
| UH-7 | Trazabilidad sync catalog | catalog-sync-log |
| UH-8 | Integración con catalog-service | catalog-client |

---

## 2. Modelo DSL

Los modelos están en `models/payment/`.

| Modelo XML | Versión | AggregateRoot | ModuleType |
|------------|---------|:---:|---|
| `payment.xml` | 1.0.0 | ✓ | aggregate-root |
| `payment-gateway.xml` | 1.0.0 | ✗ | catalog |
| `payment-attempt.xml` | 1.0.0 | ✗ | entity |
| `payment-master-data.xml` | 1.0.0 | ✗ | catalog |
| `payment-customer-gateway-eligibility.xml` | 1.0.0 | ✗ | projection |
| `payment-merchant-gateway-eligibility.xml` | 1.0.0 | ✗ | projection |
| `catalog-sync-log.xml` | 1.0.0 | ✗ | entity |

### Estructura de un modelo DSL

```xml
<domain-model name="payment" schemaVersion="2.0" version="1.0.0"
              boundedContext="payment" aggregateRoot="true" moduleType="aggregate-root">
  <fields>
    <field name="code" type="string"/>
    <field name="merchantId" type="uuid"/>
    <field name="customerId" type="uuid"/>
    <field name="orderId" type="uuid"/>
    <field name="amount" type="decimal" precision="12" scale="2"/>
    <field name="currency" type="string"/>
    <field name="status" type="string"/>
    <field name="idempotencyKey" type="string"/>
  </fields>
</domain-model>
```

---

## 3. Arquitectura

### 3.1 Patrones

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Command/query separados. |
| **Event Sourcing** | Eventos inmutables + EventStore + Kafka. |
| **Event-Driven** | Proyecciones sincronizadas vía `CustomerGatewayOnboarding*` y `MerchantGatewayConfig*`. |
| **Saga Pattern** | 4 sagas cross-context + 7 sagas CRUD por módulo. |
| **DDD** | Aggregate root *Payment*; entidades *PaymentAttempt*; proyecciones *Eligibility*. |
| **Catalog-fallback** | Breaker + cache TTL 5 min. |

### 3.2 Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│              PAYMENT MICROSERVICE  (3005)                  │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│        │              │              │                     │
│   CommandBus      QueryBus      Resolvers                  │
│        │              │                                    │
│   Service ↔ Repository → PostgreSQL (payment-service)      │
│                                                            │
│  KafkaEventPublisher ─ EventStore ─ KafkaEventSubscriber   │
│                         │                                  │
│                   CatalogClient (breaker + cache)          │
│                                                            │
│  Projection Sync Sagas:                                    │
│   ← customer.customer-gateway-onboarding-*                 │
│   ← merchant.merchant-gateway-config-*                     │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ (base.event, *.event, event-registry.ts)
├── graphql/ guards/ interceptors/ modules/ queries/
├── repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

### 4.1 Payment
- **Entidad**: `Payment` — `code`, `externalReference`, `merchantId`, `customerId`, `orderId`, `amount`, `currency`, `status`, `idempotencyKey`, `gatewayIds`.

### 4.2 PaymentGateway
- **Entidad**: `PaymentGateway` — `code`, `providerType`, `status`, `integrationMode`, `requiresCustomerOnboarding`, `requiresMerchantOnboarding`, `supportsTokenization`, `supportsAuthorization`, `supportsCapture`, `supportsRefund`, `priority`.

### 4.3 PaymentAttempt
- **Entidad**: `PaymentAttempt` — `paymentId`, `attemptNumber`, `gatewayId`, `status`, `requestedAmount`, `currency`, `requestReference`, `responseReference`, `errorCode`, `errorMessage`, `executedAt`, `finishedAt`.

### 4.4 PaymentMasterData
- **Entidad**: `PaymentMasterData` — `category`, `code`, `displayName`, `description`, `isActive`, `sortOrder`, `isDefault`, `metadata`.

### 4.5 PaymentCustomerGatewayEligibility (proyección)
- **Entidad**: `PaymentCustomerGatewayEligibility` — `customerGatewayOnboardingId`, `customerId`, `gatewayId`, `status`, `requiresRevalidation`, `expiresAt`, `externalSessionReference`, `metadata`.

### 4.6 PaymentMerchantGatewayEligibility (proyección)
- **Entidad**: `PaymentMerchantGatewayEligibility` — `merchantGatewayConfigId`, `merchantId`, `gatewayId`, `status`, `isActive`, `acceptedCurrencies`, `acceptedPaymentMethodTypes`, `settlementMode`, `metadata`.

### 4.7 CatalogSyncLog
- Trazabilidad sync catalog-service (categoryCode, triggeredBy, outcome).

### 4.8 CatalogClient
- `CatalogClientService`, `CatalogSyncService`, `CatalogKafkaConsumer`, `CatalogSyncController` (`/api/catalog-sync/health|status|run`).

---

## 5. Eventos Publicados

| Módulo | Evento | Tópico Kafka | Versión | Replayable |
|--------|--------|--------------|---------|:---:|
| payment | `PaymentCreatedEvent` | `payment.payment-created` | 1.0.0 | ✓ |
| payment | `PaymentUpdatedEvent` | `payment.payment-updated` | 1.0.0 | ✓ |
| payment | `PaymentDeletedEvent` | `payment.payment-deleted` | 1.0.0 | ✓ |
| payment | `PaymentSucceededEvent` | `payment.payment-succeeded` | 1.0.0 | ✓ |
| payment | `PaymentFailedEvent` | `payment.payment-failed` | 1.0.0 | ✓ |
| payment-gateway | `PaymentGatewayCreatedEvent` | `payment.gateway-created` | 1.0.0 | ✓ |
| payment-gateway | `PaymentGatewayUpdatedEvent` | `payment.gateway-updated` | 1.0.0 | ✓ |
| payment-gateway | `PaymentGatewayDeletedEvent` | `payment.gateway-deleted` | 1.0.0 | ✓ |
| payment-attempt | `PaymentAttemptCreatedEvent` | `payment.attempt-created` | 1.0.0 | ✓ |
| payment-attempt | `PaymentAttemptUpdatedEvent` | `payment.attempt-updated` | 1.0.0 | ✓ |
| payment-attempt | `PaymentAttemptDeletedEvent` | `payment.attempt-deleted` | 1.0.0 | ✓ |
| payment-master-data | `PaymentMasterDataCreatedEvent` | `payment.masterdata-created` | 1.0.0 | ✓ |
| payment-master-data | `PaymentMasterDataUpdatedEvent` | `payment.masterdata-updated` | 1.0.0 | ✓ |
| payment-master-data | `PaymentMasterDataDeletedEvent` | `payment.masterdata-deleted` | 1.0.0 | ✓ |
| payment-customer-gateway-eligibility | `PaymentCustomerGatewayEligibilityCreatedEvent` | `payment.cust-gateway-elig-created` | 1.0.0 | ✓ |
| payment-customer-gateway-eligibility | `PaymentCustomerGatewayEligibilityUpdatedEvent` | `payment.cust-gateway-elig-updated` | 1.0.0 | ✓ |
| payment-customer-gateway-eligibility | `PaymentCustomerGatewayEligibilityDeletedEvent` | `payment.cust-gateway-elig-deleted` | 1.0.0 | ✓ |
| payment-merchant-gateway-eligibility | `PaymentMerchantGatewayEligibilityCreatedEvent` | `payment.merc-gateway-elig-created` | 1.0.0 | ✓ |
| payment-merchant-gateway-eligibility | `PaymentMerchantGatewayEligibilityUpdatedEvent` | `payment.merc-gateway-elig-updated` | 1.0.0 | ✓ |
| payment-merchant-gateway-eligibility | `PaymentMerchantGatewayEligibilityDeletedEvent` | `payment.merc-gateway-elig-deleted` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogCreatedEvent` | `payment.catalog-sync-log-created` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogUpdatedEvent` | `payment.catalog-sync-log-updated` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogDeletedEvent` | `payment.catalog-sync-log-deleted` | 1.0.0 | ✓ |

Sagas failed publican `payment.*-failed` (replayable: false) para cada módulo.

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* entidad */ },
    "metadata": {
      "initiatedBy": "user-id", "correlationId": "uuid",
      "eventName": "PaymentSucceededEvent", "eventVersion": "1.0.0",
      "sourceService": "payment-service", "retryCount": 0,
      "idempotencyKey": "uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

Payment consume eventos cross-context para mantener proyecciones actualizadas.

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| payment (saga) | `CustomerGatewayOnboardingStartedEvent` | customer-service | `PaymentOnboardingStartedSyncSaga` → marca eligibility IN_PROGRESS |
| payment (saga) | `CustomerGatewayOnboardingApprovedEvent` | customer-service | `PaymentOnboardingApprovedSyncSaga` → eligibility APPROVED |
| payment (saga) | `CustomerGatewayOnboardingRejectedEvent` | customer-service | `PaymentOnboardingRejectedSyncSaga` → eligibility REJECTED |
| payment (saga) | `CustomerGatewayOnboardingExpiredEvent` | customer-service | `PaymentOnboardingExpiredSyncSaga` → eligibility EXPIRED |
| payment-merchant-gateway-eligibility | `MerchantGatewayConfigUpdatedEvent` | merchant-service | Actualiza eligibility del merchant |
| payment-merchant-gateway-eligibility | `MerchantGatewayConfigActivatedEvent` | merchant-service | Activa eligibility |
| payment-merchant-gateway-eligibility | `MerchantGatewayConfigDeactivatedEvent` | merchant-service | Desactiva eligibility |
| catalog-client | `catalog.catalog-item-upserted` | catalog-service | Invalida caché + syncCategory |
| catalog-client | `catalog.catalog-item-deprecated` | catalog-service | Invalida caché + syncCategory |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables; `EventIdempotencyService` deduplica.

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/<entities>/command` | `CreateXxxDto` |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` |
| DELETE | `/api/<entities>/command/:id` | — |
| DELETE | `/api/<entities>/command/bulk` | — |

### 7.2 Query CRUD

| Método | Ruta | Query Params |
|--------|------|--------------|
| GET | `/api/<entities>/query/list` | `page, size, sort, order, search` |
| GET | `/api/<entities>/query/:id` | — |
| GET | `/api/<entities>/query/field/:field` | `value, page, size` |
| GET | `/api/<entities>/query/pagination` | `page, size` |
| GET | `/api/<entities>/query/count` | — |
| GET | `/api/<entities>/query/search` | `where` |
| GET | `/api/<entities>/query/find-one` | `where` |
| GET | `/api/<entities>/query/find-one-or-fail` | `where` |

### 7.3 Prefijos por módulo

| Módulo | Prefijo Command | Prefijo Query |
|--------|-----------------|---------------|
| payment | `/api/payments/command` | `/api/payments/query` |
| payment-gateway | `/api/paymentgateways/command` | `/api/paymentgateways/query` |
| payment-attempt | `/api/paymentattempts/command` | `/api/paymentattempts/query` |
| payment-master-data | `/api/paymentmasterdatas/command` | `/api/paymentmasterdatas/query` |
| payment-customer-gateway-eligibility | `/api/paymentcustomergatewayeligibilitys/command` | `/api/paymentcustomergatewayeligibilitys/query` |
| payment-merchant-gateway-eligibility | `/api/paymentmerchantgatewayeligibilitys/command` | `/api/paymentmerchantgatewayeligibilitys/query` |
| catalog-sync-log | `/api/catalogsynclogs/command` | `/api/catalogsynclogs/query` |
| catalog-client | `/api/catalog-sync` | — |

### 7.4 DTOs principales

```json
// CreatePaymentDto
{ "code":"PAY-001", "merchantId":"UUID", "customerId":"UUID", "orderId":"UUID",
  "amount":99.99, "currency":"MXN", "status":"PENDING", "idempotencyKey":"uuid",
  "gatewayIds":["UUID1","UUID2"] }

// CreatePaymentAttemptDto
{ "paymentId":"UUID", "attemptNumber":1, "gatewayId":"UUID",
  "status":"PENDING", "requestedAmount":99.99, "currency":"MXN" }
```

---

## 8. Guía para Desarrolladores

### 8.1 Crear un Evento

```typescript
export class PaymentSucceededEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<Payment>) { super(aggregateId); }
  static create(id, instance, userId, correlationId = uuidv4()) {
    return new PaymentSucceededEvent(id, { instance, metadata: { initiatedBy: userId, correlationId } });
  }
}
```

Registrar en `event-registry.ts`; publicar con dual publish.

### 8.2 Crear una Saga cross-context

```typescript
@Injectable()
export class PaymentOnboardingApprovedSyncSaga {
  @Saga()
  onApproved = ($e: Observable<CustomerGatewayOnboardingApprovedEvent>) => $e.pipe(
    ofType(CustomerGatewayOnboardingApprovedEvent),
    mergeMap(e => from(this.eligibilityService.upsertFromOnboarding(e.payload.instance))),
    map(() => null),
  );
}
```

---

## 9. Test E2E con curl

```bash
cd payment-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash payment-service/src/docs/e2e-test.sh
```

Cobertura objetivo 100% UH + Swagger + Kafka:

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health + DB baseline | Infra |
| 1 | Crear payment-gateway | `payment-gateway` |
| 2 | Crear payment → `payment.payment-created` | `payment` |
| 3 | Crear payment-attempt → `payment.attempt-created` | `payment-attempt` |
| 4 | Update payment status SUCCEEDED → `payment-succeeded` | Kafka produce |
| 5 | Update payment status FAILED (caso negativo) → `payment-failed` | Kafka produce |
| 6 | Crear payment-master-data | `payment-master-data` |
| 7 | Projection sync: crear eligibility customer → `cust-gateway-elig-created` | `payment-customer-gateway-eligibility` |
| 8 | Projection sync: crear eligibility merchant → `merc-gateway-elig-created` | `payment-merchant-gateway-eligibility` |
| 9 | Catalog-sync health + status + run manual | `catalog-client` |
| 10 | `kcat -L` verifica topics `payment.*` | Kafka probe |
| 11 | `kcat -C` consume topic `customer.customer-gateway-onboarding-approved` (cross-ms, WARN si customer down) | Kafka subscribe |
| 12 | Limpieza | Todos |

Requisitos: payment-service ↑, PostgreSQL, `curl` + `jq`; `kcat` opcional; customer-service + merchant-service opcional (WARN si no).

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

| Módulo | Saga | Handlers |
|--------|------|----------|
| payment | `PaymentCrudSaga` | Created/Updated/Deleted/Succeeded |
| payment | `PaymentOnboardingStartedSyncSaga` | CustomerGatewayOnboardingStarted |
| payment | `PaymentOnboardingApprovedSyncSaga` | CustomerGatewayOnboardingApproved |
| payment | `PaymentOnboardingRejectedSyncSaga` | CustomerGatewayOnboardingRejected |
| payment | `PaymentOnboardingExpiredSyncSaga` | CustomerGatewayOnboardingExpired |
| payment-gateway | `PaymentGatewayCrudSaga` | Created/Updated/Deleted |
| payment-attempt | `PaymentAttemptCrudSaga` | Created/Updated/Deleted |
| payment-master-data | `PaymentMasterDataCrudSaga` | Created/Updated/Deleted |
| payment-customer-gateway-eligibility | `PaymentCustomerGatewayEligibilityCrudSaga` | Created/Updated/Deleted |
| payment-merchant-gateway-eligibility | `PaymentMerchantGatewayEligibilityCrudSaga` | Created/Updated/Deleted |
| catalog-sync-log | `CatalogSyncLogCrudSaga` | Created/Updated/Deleted |

### 10.2 Totales

- **Eventos registrados**: 30 (≈23 dominio + 7 saga-failed)
- **Topics Kafka**: 30 main + 30 retry + 30 DLQ = **90**

### 10.3 Sagas cross-context

Las 4 sagas `PaymentOnboarding*SyncSaga` se activan por eventos Kafka de `customer-service`. Las proyecciones `merchant-gateway-eligibility` se actualizan por eventos Kafka de `merchant-service`.

### 10.4 Dual publish

Para activar sagas `@Saga()` in-process, servicios deben hacer dual publish (`eventBus.publish` + `eventPublisher.publish`).

---

## 11. Variables de Entorno

| Variable | Uso |
|----------|-----|
| `APP_NAME` / `STAGE` / `PORT` | 3005 |
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | PostgreSQL (payment-service) |
| `JWT_SECRET` / `API_KEY` / `SA_EMAIL` / `SA_PWD` | Auth |
| `KAFKA_ENABLED` / `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka |
| `KAFKA_IDEMPOTENCY_TTL_MS` / `KAFKA_TRUSTED_PRODUCERS` | Kafka |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` | Event sourcing |
| `REDIS_HOST/PORT/TTL` | Redis cache |
| `CATALOG_BASE_URL` / `CATALOG_SYNC_INTERVAL_MS` | CatalogClient |
| `CATALOG_BREAKER_ERROR_THRESHOLD` / `CATALOG_BREAKER_RESET_MS` | Breaker |
| `SWAGGER_USER` / `SWAGGER_PWD` | Swagger basic auth |
| `CLD_*` / `MAIL_*` | Cloudinary / Mail (legacy) |
| `LOG_API_BASE_URL` / `LOG_EXECUTION_TIME` / `LOG_KAFKA_TOPIC` | Codetrace |

---

## 12. Build & Run

```bash
cd payment-service
npm install && npm run build
node dist/main.js
# o docker-compose up payment-service
```

---

## 13. Integración con catalog-service

Documentación canónica de `CatalogClientModule`: [docs/README-catalog-integration.md](../../../docs/README-catalog-integration.md).
