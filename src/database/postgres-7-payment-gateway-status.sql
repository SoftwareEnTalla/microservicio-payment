-- ====================================================================
-- payment_gateway_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "payment_gateway_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('DRAFT', 'Draft', '', '{}'::jsonb, 'system', TRUE, 'paymentgatewaystatus'),
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'paymentgatewaystatus'),
  ('INACTIVE', 'Inactive', '', '{}'::jsonb, 'system', TRUE, 'paymentgatewaystatus'),
  ('MAINTENANCE', 'Maintenance', '', '{}'::jsonb, 'system', TRUE, 'paymentgatewaystatus'),
  ('DEPRECATED', 'Deprecated', '', '{}'::jsonb, 'system', TRUE, 'paymentgatewaystatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
