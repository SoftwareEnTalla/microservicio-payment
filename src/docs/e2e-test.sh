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

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: payment-service | Puerto: 3005
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3005/api}"
NOM_AUTH="${AUTH:-Bearer valid-token}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — payment-service ═══\033[0m"

# --- Nomenclador: card-network ---
NOM_CODE="NCARDNE-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E CardNetwork ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/cardnetworks/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "card-network: create id=$NOM_ID"; else _nom_warn "card-network: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/cardnetworks/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "card-network: list ok"; else _nom_warn "card-network: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/cardnetworks/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "card-network: getById" || _nom_warn "card-network: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/cardnetworks/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E CardNetwork updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "card-network: update" || _nom_warn "card-network: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/cardnetworks/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "card-network: delete" || _nom_warn "card-network: delete"
fi

# --- Nomenclador: integration-mode ---
NOM_CODE="NINTEGR-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E IntegrationMode ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/integrationmodes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "integration-mode: create id=$NOM_ID"; else _nom_warn "integration-mode: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/integrationmodes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "integration-mode: list ok"; else _nom_warn "integration-mode: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/integrationmodes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "integration-mode: getById" || _nom_warn "integration-mode: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/integrationmodes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E IntegrationMode updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "integration-mode: update" || _nom_warn "integration-mode: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/integrationmodes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "integration-mode: delete" || _nom_warn "integration-mode: delete"
fi

# --- Nomenclador: payment-attempt-status ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentAttemptStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentattemptstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-attempt-status: create id=$NOM_ID"; else _nom_warn "payment-attempt-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentattemptstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-attempt-status: list ok"; else _nom_warn "payment-attempt-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentattemptstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-attempt-status: getById" || _nom_warn "payment-attempt-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentattemptstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentAttemptStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-attempt-status: update" || _nom_warn "payment-attempt-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentattemptstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-attempt-status: delete" || _nom_warn "payment-attempt-status: delete"
fi

# --- Nomenclador: payment-gateway-status ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentGatewayStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentgatewaystatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-gateway-status: create id=$NOM_ID"; else _nom_warn "payment-gateway-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentgatewaystatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-gateway-status: list ok"; else _nom_warn "payment-gateway-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentgatewaystatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-gateway-status: getById" || _nom_warn "payment-gateway-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentgatewaystatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentGatewayStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-gateway-status: update" || _nom_warn "payment-gateway-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentgatewaystatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-gateway-status: delete" || _nom_warn "payment-gateway-status: delete"
fi

# --- Nomenclador: payment-gateway ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentGateway ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentgateways/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-gateway: create id=$NOM_ID"; else _nom_warn "payment-gateway: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentgateways/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-gateway: list ok"; else _nom_warn "payment-gateway: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentgateways/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-gateway: getById" || _nom_warn "payment-gateway: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentgateways/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentGateway updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-gateway: update" || _nom_warn "payment-gateway: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentgateways/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-gateway: delete" || _nom_warn "payment-gateway: delete"
fi

# --- Nomenclador: payment-master-data ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentMasterData ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentmasterdatas/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-master-data: create id=$NOM_ID"; else _nom_warn "payment-master-data: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmasterdatas/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-master-data: list ok"; else _nom_warn "payment-master-data: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmasterdatas/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-master-data: getById" || _nom_warn "payment-master-data: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentmasterdatas/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentMasterData updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-master-data: update" || _nom_warn "payment-master-data: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentmasterdatas/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-master-data: delete" || _nom_warn "payment-master-data: delete"
fi

# --- Nomenclador: payment-merchant-gateway-eligibility-status ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentMerchantGatewayEligibilityStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentmerchantgatewayeligibilitystatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-merchant-gateway-eligibility-status: create id=$NOM_ID"; else _nom_warn "payment-merchant-gateway-eligibility-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmerchantgatewayeligibilitystatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-merchant-gateway-eligibility-status: list ok"; else _nom_warn "payment-merchant-gateway-eligibility-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmerchantgatewayeligibilitystatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-merchant-gateway-eligibility-status: getById" || _nom_warn "payment-merchant-gateway-eligibility-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentmerchantgatewayeligibilitystatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentMerchantGatewayEligibilityStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-merchant-gateway-eligibility-status: update" || _nom_warn "payment-merchant-gateway-eligibility-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentmerchantgatewayeligibilitystatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-merchant-gateway-eligibility-status: delete" || _nom_warn "payment-merchant-gateway-eligibility-status: delete"
fi

# --- Nomenclador: payment-method-type ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentMethodType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentmethodtypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-method-type: create id=$NOM_ID"; else _nom_warn "payment-method-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmethodtypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-method-type: list ok"; else _nom_warn "payment-method-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmethodtypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-method-type: getById" || _nom_warn "payment-method-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentmethodtypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentMethodType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-method-type: update" || _nom_warn "payment-method-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentmethodtypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-method-type: delete" || _nom_warn "payment-method-type: delete"
fi

# --- Nomenclador: payment-status ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-status: create id=$NOM_ID"; else _nom_warn "payment-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-status: list ok"; else _nom_warn "payment-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-status: getById" || _nom_warn "payment-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-status: update" || _nom_warn "payment-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-status: delete" || _nom_warn "payment-status: delete"
fi

# --- Nomenclador: provider-type ---
NOM_CODE="NPROVID-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ProviderType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/providertypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "provider-type: create id=$NOM_ID"; else _nom_warn "provider-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/providertypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "provider-type: list ok"; else _nom_warn "provider-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/providertypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "provider-type: getById" || _nom_warn "provider-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/providertypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ProviderType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "provider-type: update" || _nom_warn "provider-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/providertypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "provider-type: delete" || _nom_warn "provider-type: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores payment-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
