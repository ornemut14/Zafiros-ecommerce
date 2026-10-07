-- Migración: sección Materiales (Zafiros).
-- Ejecutar UNA sola vez en el editor SQL de Neon o Supabase (el mismo lugar
-- donde se ejecutaron schema.sql y seed-produccion.sql).
-- Es seguro repetirlo: usa IF NOT EXISTS y ON CONFLICT DO NOTHING.
--
-- Qué hace:
--   1. Crea la tabla materials (id, nombre único).
--   2. Agrega products.material_id (OPCIONAL): los productos actuales quedan
--      como "Sin especificar" hasta que les asignes material desde el panel.
--   3. Carga materiales base (se pueden renombrar o borrar desde el panel).

CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS material_id INT NULL REFERENCES materials(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS products_material_id_idx ON products (material_id);

INSERT INTO materials (name) VALUES
  ('Plata 925'),
  ('Oro'),
  ('Acero quirúrgico'),
  ('Enchapado en oro')
ON CONFLICT (name) DO NOTHING;

-- Verificación (tiene que devolver 4 filas):
-- SELECT * FROM materials ORDER BY name ASC;
