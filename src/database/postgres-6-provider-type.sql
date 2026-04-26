-- ====================================================================
-- provider_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "provider_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('STRIPE', 'Stripe', '', '{}'::jsonb, 'system', TRUE, 'providertype'),
  ('PAYPAL', 'Paypal', '', '{}'::jsonb, 'system', TRUE, 'providertype'),
  ('MASTERCARD', 'Mastercard', '', '{}'::jsonb, 'system', TRUE, 'providertype'),
  ('ADYEN', 'Adyen', '', '{}'::jsonb, 'system', TRUE, 'providertype'),
  ('LOCAL_PROVIDER', 'Local Provider', '', '{}'::jsonb, 'system', TRUE, 'providertype'),
  ('OTHER', 'Other', '', '{}'::jsonb, 'system', TRUE, 'providertype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
