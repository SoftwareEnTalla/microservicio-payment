-- ════════════════════════════════════════════════════════════════════
-- card_network_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "card_network_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('VISA', 'Visa', 'Red Visa', jsonb_build_object('description','Red Visa'), 'system', TRUE, 'cardnetwork'),
  ('MASTERCARD', 'Mastercard', 'Red Mastercard', jsonb_build_object('description','Red Mastercard'), 'system', TRUE, 'cardnetwork'),
  ('AMEX', 'American Express', 'Red American Express', jsonb_build_object('description','Red American Express'), 'system', TRUE, 'cardnetwork'),
  ('DISCOVER', 'Discover', 'Red Discover', jsonb_build_object('description','Red Discover'), 'system', TRUE, 'cardnetwork'),
  ('LOCAL_NETWORK', 'Red local', 'Red local nacional', jsonb_build_object('description','Red local nacional'), 'system', TRUE, 'cardnetwork')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
