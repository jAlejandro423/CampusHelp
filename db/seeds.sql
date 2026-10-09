-- CampusHelp · db/seeds.sql
-- MySQL 8 · Issue #5 · Datos base para desarrollo, bandeja e indicadores.
-- Uso: mysql -u root -p < db/schema.sql && mysql -u root -p < db/seeds.sql
-- Requiere el esquema de la issue #4. IDs explícitos para trazabilidad en
-- pruebas (CP-01…CP-10) y demo del flujo completo.
-- Convenciones: singular, snake_case, utf8mb4 (tildes en estados/categorías).

-- DEF-01 (#56): ver db/schema.sql. Sin esto, el cliente mysql en Windows
-- (cp850) guarda corruptos los textos con tildes.
SET NAMES utf8mb4;

USE campushelp;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE historial;
TRUNCATE TABLE atencion;
TRUNCATE TABLE caso;
TRUNCATE TABLE categoria;
TRUNCATE TABLE area;
TRUNCATE TABLE usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- 5 áreas del taller.
INSERT INTO area (id, nombre, descripcion, activa) VALUES
  (1, 'Hardware', 'Equipos físicos: computadores, periféricos, proyectores e impresoras.', TRUE),
  (2, 'Software', 'Instalación, errores y actualización de software institucional.', TRUE),
  (3, 'Red y conectividad', 'Wi-Fi institucional, Internet y red cableada.', TRUE),
  (4, 'Cuentas y acceso', 'Contraseñas, bloqueos, correo institucional y permisos.', TRUE),
  (5, 'Plataformas académicas', 'Campus virtual y sistemas académicos.', TRUE);

-- 16 categorías del taller (4 + 3 + 3 + 4 + 2).
INSERT INTO categoria (id, area_id, nombre, descripcion, activa) VALUES
  (1, 1, 'Computador', 'Computador institucional que no enciende o falla.', TRUE),
  (2, 1, 'Periférico', 'Teclado, mouse u otro periférico defectuoso.', TRUE),
  (3, 1, 'Proyector', 'Proyector de aula con fallas.', TRUE),
  (4, 1, 'Impresora', 'Impresora institucional con problemas.', TRUE),
  (5, 2, 'Instalación', 'Instalación de software institucional autorizado.', TRUE),
  (6, 2, 'Error', 'Error de una aplicación institucional.', TRUE),
  (7, 2, 'Actualización', 'Actualización de software autorizado.', TRUE),
  (8, 3, 'Wi-Fi', 'Sin acceso al Wi-Fi institucional.', TRUE),
  (9, 3, 'Internet', 'Sin acceso a Internet.', TRUE),
  (10, 3, 'Red cableada', 'Problemas para conectarse a la red cableada.', TRUE),
  (11, 4, 'Contraseña', 'Recuperación de contraseña institucional.', TRUE),
  (12, 4, 'Bloqueo', 'Cuenta bloqueada.', TRUE),
  (13, 4, 'Correo', 'Problemas con el correo institucional.', TRUE),
  (14, 4, 'Permisos', 'Acceso o permisos a recursos.', TRUE),
  (15, 5, 'Campus virtual', 'Acceso o funcionamiento del campus virtual.', TRUE),
  (16, 5, 'Sistema académico', 'Acceso o funcionamiento del sistema académico.', TRUE);

-- 6 usuarios de prueba (D-02): 2 solicitantes, 2 agentes, 1 validador, 1 administrador.
INSERT INTO usuario (id, nombre, correo, rol, activo) VALUES
  (1, 'Laura Gómez', 'laura.gomez@universidad.edu.co', 'solicitante', TRUE),
  (2, 'Carlos Ruiz', 'carlos.ruiz@universidad.edu.co', 'solicitante', TRUE),
  (3, 'Diego Torres', 'diego.torres@universidad.edu.co', 'agente', TRUE),
  (4, 'María Prieto', 'maria.prieto@universidad.edu.co', 'agente', TRUE),
  (5, 'Pedro Validador', 'pedro.val@universidad.edu.co', 'validador', TRUE),
  (6, 'Ana Admin', 'ana.admin@universidad.edu.co', 'administrador', TRUE);

-- 6 casos de ejemplo en distintos estados (bandeja + indicadores por
-- estado/tipo/prioridad). Cubren las 5 áreas, ambos tipos y P1/P2/P3.
INSERT INTO caso (id, tipo, titulo, descripcion, prioridad, estado, usuario_id, categoria_id, agente_id, fecha_creacion, fecha_asignacion, fecha_cierre) VALUES
  (1, 'Incidente', 'Sin acceso a Wi-Fi institucional en biblioteca', 'No puedo conectarme al Wi-Fi institucional desde la biblioteca central.', 'P1', 'Pendiente', 1, 8, NULL, '2026-10-06 09:00:00', NULL, NULL),
  (2, 'Solicitud', 'Instalación de Visual Studio en equipo institucional', 'Necesito que instalen Visual Studio en mi equipo institucional del laboratorio.', 'P2', 'En análisis', 2, 5, NULL, '2026-10-06 10:30:00', NULL, NULL),
  (3, 'Incidente', 'Computador del laboratorio no enciende', 'El computador del laboratorio 302 no enciende desde esta mañana.', 'P1', 'En atención', 1, 1, 3, '2026-10-05 11:00:00', '2026-10-06 08:30:00', NULL),
  (4, 'Incidente', 'No recibo correos institucionales', 'Mi correo institucional no recibe mensajes desde ayer en la tarde.', 'P2', 'En validación', 2, 13, 4, '2026-10-05 09:15:00', '2026-10-05 14:00:00', NULL),
  (5, 'Solicitud', 'Acceso al campus virtual para curso nuevo', 'Solicito acceso al campus virtual para el curso de Software 3.', 'P3', 'Cerrada', 1, 15, 3, '2026-10-05 08:00:00', '2026-10-05 09:00:00', '2026-10-06 16:00:00'),
  (6, 'Incidente', 'Sin Internet en sala de estudio', 'No hay Internet en la sala de estudio del segundo piso.', 'P2', 'Cerrada', 2, 9, 4, '2026-10-05 10:00:00', '2026-10-05 11:00:00', '2026-10-07 12:00:00');

-- Atenciones: caso 3 en curso (sin solución); casos 4–6 con diagnóstico y solución.
INSERT INTO atencion (id, caso_id, diagnostico, solucion, fecha, agente_id) VALUES
  (1, 3, 'Fuente de poder aparentemente defectuosa; se deja equipo en observación.', NULL, '2026-10-06 10:00:00', 3),
  (2, 4, 'Bandeja llena y regla de reenvío mal configurada.', 'Se liberó cuota y se corrigió la regla; el correo ya recibe mensajes.', '2026-10-06 11:00:00', 4),
  (3, 5, 'Usuario no matriculado en el curso dentro del campus virtual.', 'Se inscribió al usuario en el curso; ya puede ingresar.', '2026-10-06 15:00:00', 3),
  (4, 6, 'Switch de la sala con puerto bloqueado.', 'Se desbloqueó el puerto y se verificó conectividad en 3 equipos.', '2026-10-07 11:30:00', 4);

-- Historial trazable de cada caso (un evento por transición).
INSERT INTO historial (id, caso_id, evento, estado_anterior, estado_nuevo, usuario_id, fecha, detalle) VALUES
  (1, 1, 'creacion', NULL, 'Pendiente', 1, '2026-10-06 09:00:00', 'Caso registrado por la solicitante.'),
  (2, 2, 'creacion', NULL, 'Pendiente', 2, '2026-10-06 10:30:00', 'Caso registrado por el solicitante.'),
  (3, 2, 'cambio_estado', 'Pendiente', 'En análisis', 3, '2026-10-06 11:00:00', 'Se toma para análisis y clasificación.'),
  (4, 3, 'creacion', NULL, 'Pendiente', 1, '2026-10-05 11:00:00', 'Caso registrado por la solicitante.'),
  (5, 3, 'cambio_estado', 'Pendiente', 'En análisis', 3, '2026-10-05 15:00:00', 'Se clasifica como Hardware/Computador P1.'),
  (6, 3, 'asignacion', 'En análisis', 'En atención', 3, '2026-10-06 08:30:00', 'El agente Diego asume la atención.'),
  (7, 4, 'creacion', NULL, 'Pendiente', 2, '2026-10-05 09:15:00', 'Caso registrado por el solicitante.'),
  (8, 4, 'asignacion', 'Pendiente', 'En atención', 4, '2026-10-05 14:00:00', 'La agente María asume la atención.'),
  (9, 4, 'envio_validacion', 'En atención', 'En validación', 4, '2026-10-06 11:00:00', 'Solución registrada; pasa a validación.'),
  (10, 5, 'creacion', NULL, 'Pendiente', 1, '2026-10-05 08:00:00', 'Caso registrado por la solicitante.'),
  (11, 5, 'asignacion', 'Pendiente', 'En atención', 3, '2026-10-05 09:00:00', 'El agente Diego asume la atención.'),
  (12, 5, 'envio_validacion', 'En atención', 'En validación', 3, '2026-10-06 15:00:00', 'Solución registrada; pasa a validación.'),
  (13, 5, 'cierre', 'En validación', 'Cerrada', 5, '2026-10-06 16:00:00', 'Validación aprobada; se cierra el caso.'),
  (14, 6, 'creacion', NULL, 'Pendiente', 2, '2026-10-05 10:00:00', 'Caso registrado por el solicitante.'),
  (15, 6, 'asignacion', 'Pendiente', 'En atención', 4, '2026-10-05 11:00:00', 'La agente María asume la atención.'),
  (16, 6, 'envio_validacion', 'En atención', 'En validación', 4, '2026-10-07 11:30:00', 'Solución registrada; pasa a validación.'),
  (17, 6, 'cierre', 'En validación', 'Cerrada', 5, '2026-10-07 12:00:00', 'Validación aprobada; se cierra el caso.');
