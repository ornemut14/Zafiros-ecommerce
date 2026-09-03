-- Esquema de base de datos: Joyería E-commerce
-- Motor: MySQL 5.7+ / MariaDB
-- Importar desde phpMyAdmin: Base de datos > (elegí/creá "joyeria") > pestaña "SQL" > pegar y ejecutar

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  icon VARCHAR(10) DEFAULT '💎',
  image_url VARCHAR(500) DEFAULT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS store_config (
  id INT PRIMARY KEY,
  whatsapp_number VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categorías iniciales sugeridas
INSERT IGNORE INTO categories (name) VALUES
  ('Anillos'), ('Collares'), ('Aros'), ('Pulseras');

-- Fila única de configuración (id fijo = 1)
INSERT IGNORE INTO store_config (id, whatsapp_number) VALUES (1, NULL);

-- MIGRACIÓN: si ya habías corrido este schema.sql antes de tener fotos de producto,
-- corré esta línea aparte para agregar la columna nueva sin perder tus datos:
-- ALTER TABLE products ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;
