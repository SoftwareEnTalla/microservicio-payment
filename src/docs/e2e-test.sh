#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — payment-service (puerto 3005)
# Módulos: payments, paymentattempts, paymentgateways, paymentmasterdatas,
#          paymentcustomergatewayeligibilitys, paymentmerchantgatewayeligibilitys,
#          catalogsynclogs, catalog-client
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3005/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — Payment Microservice — 100% UH + Swagger         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/payments/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 Payment"
P=$(cat <<EOF
{"name":"E2E Payment ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PAY-${UNIQUE}","amount":100.0,"currency":"EUR","status":"PENDING",
 "customerId":"00000000-0000-0000-0000-000000000001","merchantId":"00000000-0000-0000-0000-000000000002",
 "metadata":{"e2e":true}}
EOF
)
smoke_module "payments" "$P"

log_step 2 "UH-2 PaymentAttempt"
P=$(cat <<EOF
{"name":"E2E PA ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PA-${UNIQUE}","paymentId":"00000000-0000-0000-0000-000000000001",
 "attemptNumber":1,"status":"PENDING","metadata":{"e2e":true}}
EOF
)
smoke_module "paymentattempts" "$P"

log_step 3 "UH-3 PaymentGateway"
P=$(cat <<EOF
{"name":"E2E PG ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PG-${UNIQUE}","providerName":"STRIPE","status":"ENABLED","metadata":{"e2e":true}}
EOF
)
smoke_module "paymentgateways" "$P"

log_step 4 "UH-4 PaymentMasterData"
P=$(cat <<EOF
{"name":"E2E PMD ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PMD-${UNIQUE}","key":"E2E_KEY","value":"E2E_VALUE","metadata":{"e2e":true}}
EOF
)
smoke_module "paymentmasterdatas" "$P"

log_step 5 "UH-5 PaymentCustomerGatewayEligibility"
P=$(cat <<EOF
{"name":"E2E PCE ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PCE-${UNIQUE}","customerId":"00000000-0000-0000-0000-000000000001",
 "gatewayId":"00000000-0000-0000-0000-000000000002","eligible":true,"metadata":{"e2e":true}}
EOF
)
smoke_module "paymentcustomergatewayeligibilitys" "$P"

log_step 6 "UH-6 PaymentMerchantGatewayEligibility"
P=$(cat <<EOF
{"name":"E2E PME ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PME-${UNIQUE}","merchantId":"00000000-0000-0000-0000-000000000001",
 "gatewayId":"00000000-0000-0000-0000-000000000002","eligible":true,"metadata":{"e2e":true}}
EOF
)
smoke_module "paymentmerchantgatewayeligibilitys" "$P"

log_step 7 "UH-7 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"payment-status","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 8 "UH-8 catalog-client"
smoke_catalog_client

log_step 9 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*payment[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics payment.* detectados"; else log_warn "Sin topics payment.*"; fi
else log_warn "kcat no instalado — skipping"; fi

print_summary "payment-service"
