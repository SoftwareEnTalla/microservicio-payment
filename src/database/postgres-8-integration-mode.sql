-- ====================================================================
-- integration_mode_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "integration_mode_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('REDIRECT', 'Redirect', '', '{}'::jsonb, 'system', TRUE, 'integrationmode'),
  ('HOSTED_FIELDS', 'Hosted Fields', '', '{}'::jsonb, 'system', TRUE, 'integrationmode'),
  ('API', 'Api', '', '{}'::jsonb, 'system', TRUE, 'integrationmode'),
  ('OAUTH', 'Oauth', '', '{}'::jsonb, 'system', TRUE, 'integrationmode'),
  ('TOKENIZED', 'Tokenized', '', '{}'::jsonb, 'system', TRUE, 'integrationmode')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
