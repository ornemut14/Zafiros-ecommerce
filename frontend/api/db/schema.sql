-- Esquema para Postgres (Neon / Supabase).
-- El proyecto migró desde MySQL en InfinityFree porque el hosting gratuito
-- bloquea las llamadas a una API desde otro dominio (ver README).
--
-- Pegar y ejecutar en el editor SQL de Neon o Supabase.

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  icon VARCHAR(10) DEFAULT '💎',
  image_url VARCHAR(500) DEFAULT NULL,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  material_id INT NULL REFERENCES materials(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS store_config (
  id INT PRIMARY KEY,
  whatsapp_number VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_material_id_idx ON products (material_id);

-- Categorías base (pueden renombrarse o borrarse desde el panel).
INSERT INTO categories (name) VALUES
  ('Anillos'), ('Cadenitas'), ('Aros'), ('Dijes'), ('Pulseras')
ON CONFLICT (name) DO NOTHING;

-- Materiales base (pueden renombrarse o borrarse desde el panel).
INSERT INTO materials (name) VALUES
  ('Plata 925'), ('Oro'), ('Acero quirúrgico'), ('Enchapado en oro')
ON CONFLICT (name) DO NOTHING;

INSERT INTO store_config (id, whatsapp_number) VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;