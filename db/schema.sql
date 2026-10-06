-- CampusHelp · db/schema.sql
-- MySQL 8 · Issue #4 · Modelo mínimo del taller
-- Ejecución desde cero: DROP + CREATE (idempotente para entorno local/demo).
-- Convenciones: tablas y columnas en snake_case y singular.

DROP DATABASE IF EXISTS campushelp;
CREATE DATABASE campushelp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campushelp;

-- Usuario de prueba (sin autenticación real, ver docs/decisiones.md D-02).
CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  rol ENUM('solicitante', 'agente', 'validador', 'administrador') NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE area (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_categoria_area_nombre UNIQUE (area_id, nombre),
  CONSTRAINT fk_categoria_area FOREIGN KEY (area_id)
    REFERENCES area (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE caso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Incidente', 'Solicitud') NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  prioridad ENUM('P1', 'P2', 'P3') NOT NULL,
  estado ENUM('Pendiente', 'En análisis', 'En atención', 'En validación', 'Cerrada') NOT NULL DEFAULT 'Pendiente',
  usuario_id INT NOT NULL,
  categoria_id INT NOT NULL,
  agente_id INT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_asignacion DATETIME NULL,
  fecha_cierre DATETIME NULL,
  CONSTRAINT fk_caso_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_caso_categoria FOREIGN KEY (categoria_id)
    REFERENCES categoria (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_caso_agente FOREIGN KEY (agente_id)
    REFERENCES usuario (id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE atencion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caso_id INT NOT NULL,
  diagnostico TEXT NOT NULL,
  solucion TEXT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  agente_id INT NOT NULL,
  CONSTRAINT fk_atencion_caso FOREIGN KEY (caso_id)
    REFERENCES caso (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_atencion_agente FOREIGN KEY (agente_id)
    REFERENCES usuario (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- historial.detalle: campo agregado (ver D-03). Guarda el motivo de
-- devolución desde validación (HU-07) y datos extra del evento.
CREATE TABLE historial (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caso_id INT NOT NULL,
  evento VARCHAR(100) NOT NULL,
  estado_anterior VARCHAR(30) NULL,
  estado_nuevo VARCHAR(30) NULL,
  usuario_id INT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  detalle TEXT NULL,
  CONSTRAINT fk_historial_caso FOREIGN KEY (caso_id)
    REFERENCES caso (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices exigidos por la issue #4 (filtros por estado/tipo/área/prioridad).
CREATE INDEX idx_caso_estado ON caso (estado);
CREATE INDEX idx_caso_usuario ON caso (usuario_id);
CREATE INDEX idx_caso_prioridad ON caso (prioridad);
