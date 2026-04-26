-- ════════════════════════════════════════════════════════════════════
-- payment_method_type_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "payment_method_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('CARD', 'Tarjeta', 'Tarjeta de crédito o débito', jsonb_build_object('description','Tarjeta de crédito o débito'), 'system', TRUE, 'paymentmethodtype'),
  ('WALLET', 'Wallet', 'Wallet digital (Apple/Google Pay, etc.)', jsonb_build_object('description','Wallet digital (Apple/Google Pay, etc.)'), 'system', TRUE, 'paymentmethodtype'),
  ('BANK_TRANSFER', 'Transferencia bancaria', 'Transferencia bancaria', jsonb_build_object('description','Transferencia bancaria'), 'system', TRUE, 'paymentmethodtype'),
  ('PAYPAL_ACCOUNT', 'Cuenta PayPal', 'Cuenta PayPal', jsonb_build_object('description','Cuenta PayPal'), 'system', TRUE, 'paymentmethodtype'),
  ('TOKENIZED_METHOD', 'Método tokenizado', 'Token guardado del cliente', jsonb_build_object('description','Token guardado del cliente'), 'system', TRUE, 'paymentmethodtype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
