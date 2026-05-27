-- ============================================================
--  PetHogar — Script de base de datos
--  Ejecutar en phpMyAdmin o terminal MySQL de XAMPP
-- ============================================================

CREATE DATABASE IF NOT EXISTS pethogar
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pethogar;

-- ---- Refugios ----
CREATE TABLE IF NOT EXISTS refugios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  ciudad      VARCHAR(80)  NOT NULL,
  direccion   VARCHAR(200),
  telefono    VARCHAR(30),
  descripcion TEXT,
  activo      TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---- Mascotas ----
CREATE TABLE IF NOT EXISTS mascotas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80)  NOT NULL,
  tipo        ENUM('Perro','Gato') NOT NULL,
  tamano      ENUM('Pequeño','Mediano','Grande') NOT NULL,
  sexo        ENUM('Macho','Hembra') NOT NULL,
  edad        ENUM('Cachorro','Joven','Adulto') NOT NULL,
  ubicacion   VARCHAR(80)  NOT NULL,
  estado      ENUM('Disponible','Adoptado') DEFAULT 'Disponible',
  descripcion TEXT,
  imagen      VARCHAR(200),
  id_refugio  INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_refugio) REFERENCES refugios(id) ON DELETE SET NULL
);

-- ---- Usuarios ----
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  correo        VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---- Donaciones ----
CREATE TABLE IF NOT EXISTS donaciones (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(120)   NOT NULL,
  correo     VARCHAR(120)   NOT NULL,
  monto      DECIMAL(10,2)  NOT NULL,
  tipo       VARCHAR(60)    NOT NULL,
  metodo     VARCHAR(60)    NOT NULL,
  mensaje    TEXT,
  id_usuario INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================
--  Datos de ejemplo
-- ============================================================

INSERT INTO refugios (nombre, ciudad, direccion, telefono, descripcion) VALUES
('Patitas Felices',  'Cancún',           'Av. Tulum 123',     '998-123-4567', 'Refugio comprometido con el bienestar animal.'),
('Hogar Animal',     'Mérida',           'Calle 60 #45',      '999-234-5678', 'Rescatamos animales en situación de calle.'),
('Amor con Patas',   'Playa del Carmen', '5a Av. Sur 78',     '984-345-6789', 'Adopción responsable y rescate de emergencia.');

INSERT INTO mascotas (nombre, tipo, tamano, sexo, edad, ubicacion, estado, descripcion, imagen, id_refugio) VALUES
('Luna',   'Perro', 'Mediano', 'Hembra', 'Joven',   'Cancún',           'Disponible', 'Tranquila y curiosa.',          '../imagenes/bonie.jpeg',    1),
('Patotas','Perro', 'Grande',  'Macho',  'Adulto',  'Mérida',           'Disponible', 'Leal y juguetón.',              '../imagenes/LicPatas.jpeg', 2),
('Nala',   'Perro', 'Pequeño', 'Hembra', 'Joven',   'Playa del Carmen', 'Adoptado',   'Ya encontró hogar.',            '../imagenes/canela.jpeg',   3),
('Michi',  'Gato',  'Pequeño', 'Macho',  'Cachorro','Cancún',           'Disponible', 'Pequeño pero con actitud.',     '../imagenes/michi.jpeg',    1),
('Lalo',   'Perro', 'Grande',  'Macho',  'Adulto',  'Cancún',           'Adoptado',   'Misión cumplida.',              '../imagenes/lalo.jpeg',     1),
('Andrix', 'Perro', 'Mediano', 'Macho',  'Joven',   'Mérida',           'Disponible', 'Dulce y sociable.',             '../imagenes/andrix.jpeg',   2);
