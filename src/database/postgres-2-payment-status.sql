-- ════════════════════════════════════════════════════════════════════
-- payment_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "payment_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('CREATED', 'Creado', 'Pago creado pendiente de procesamiento', jsonb_build_object('description','Pago creado pendiente de procesamiento'), 'system', TRUE, 'paymentstatus'),
  ('PENDING', 'Pendiente', 'Pago en proceso de autorización', jsonb_build_object('description','Pago en proceso de autorización'), 'system', TRUE, 'paymentstatus'),
  ('REQUIRES_CUSTOMER_ACTION', 'Requiere acción del cliente', 'Confirmación adicional pendiente', jsonb_build_object('description','Confirmación adicional pendiente'), 'system', TRUE, 'paymentstatus'),
  ('AUTHORIZED', 'Autorizado', 'Autorizado, pendiente de captura', jsonb_build_object('description','Autorizado, pendiente de captura'), 'system', TRUE, 'paymentstatus'),
  ('SUCCEEDED', 'Exitoso', 'Pago capturado correctamente', jsonb_build_object('description','Pago capturado correctamente'), 'system', TRUE, 'paymentstatus'),
  ('FAILED', 'Fallido', 'Pago rechazado o fallido', jsonb_build_object('description','Pago rechazado o fallido'), 'system', TRUE, 'paymentstatus'),
  ('CANCELLED', 'Cancelado', 'Pago cancelado por el cliente o el sistema', jsonb_build_object('description','Pago cancelado por el cliente o el sistema'), 'system', TRUE, 'paymentstatus'),
  ('EXPIRED', 'Expirado', 'Pago expiró antes de completarse', jsonb_build_object('description','Pago expiró antes de completarse'), 'system', TRUE, 'paymentstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
