-- ════════════════════════════════════════════════════════════════════
-- payment_attempt_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "payment_attempt_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('CREATED', 'Creado', 'Intento creado', jsonb_build_object('description','Intento creado'), 'system', TRUE, 'paymentattemptstatus'),
  ('PENDING', 'Pendiente', 'En procesamiento', jsonb_build_object('description','En procesamiento'), 'system', TRUE, 'paymentattemptstatus'),
  ('AUTHORIZED', 'Autorizado', 'Autorizado en pasarela', jsonb_build_object('description','Autorizado en pasarela'), 'system', TRUE, 'paymentattemptstatus'),
  ('CAPTURED', 'Capturado', 'Fondos capturados', jsonb_build_object('description','Fondos capturados'), 'system', TRUE, 'paymentattemptstatus'),
  ('FAILED', 'Fallido', 'Falló en pasarela', jsonb_build_object('description','Falló en pasarela'), 'system', TRUE, 'paymentattemptstatus'),
  ('EXPIRED', 'Expirado', 'Expiró sin respuesta', jsonb_build_object('description','Expiró sin respuesta'), 'system', TRUE, 'paymentattemptstatus'),
  ('RETRIED', 'Reintentado', 'Generó un nuevo intento', jsonb_build_object('description','Generó un nuevo intento'), 'system', TRUE, 'paymentattemptstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
