-- ====================================================================
-- payment_merchant_gateway_eligibility_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "payment_merchant_gateway_eligibility_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('NOT_CONFIGURED', 'Not Configured', '', '{}'::jsonb, 'system', TRUE, 'paymentmerchantgatewayeligibilitystatus'),
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'paymentmerchantgatewayeligibilitystatus'),
  ('SUSPENDED', 'Suspended', '', '{}'::jsonb, 'system', TRUE, 'paymentmerchantgatewayeligibilitystatus'),
  ('ERROR', 'Error', '', '{}'::jsonb, 'system', TRUE, 'paymentmerchantgatewayeligibilitystatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
