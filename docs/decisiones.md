# Decisiones técnicas – CampusHelp

El taller permite que el equipo proponga la tecnología siempre que quede documentada. Cada decisión registra contexto, alternativas y motivo.

## D-01 · Stack tecnológico (2026-10-05)

| Capa | Elección |
|---|---|
| Frontend | React + Vite + React Router |
| Backend | Node.js + Express (API REST) |
| Base de datos | MySQL 8 con `mysql2` |

**Contexto:** 3 integrantes y 8 días para entregar un MVP persistente y demostrable.
**Alternativas consideradas:** Django/Flask + React; Node + PostgreSQL.
**Motivo:** un solo lenguaje (JavaScript) en frontend y backend, lo que permite que todos revisen el código de todos; MySQL es relacional (el modelo del taller lo es) y se instala fácilmente para la demo. *(Completar con la experiencia previa del equipo.)*
**Consecuencias:** las reglas de negocio (máquina de estados, validaciones) viven en el backend; el frontend no se considera fuente de validación.

## D-02 · Autenticación simulada (2026-10-05)

**Decisión:** no hay login real. El usuario elige un **usuario de prueba** (solicitante, agente, validador o administrador) y el frontend envía su `id` en cada petición.
**Motivo:** el taller lo permite explícitamente y así el tiempo se invierte en el flujo principal.

## D-03 · Modelo de datos (2026-10-05 · Issue #4)

Implementado en `db/schema.sql` (MySQL 8, ejecutable desde cero con `DROP DATABASE IF EXISTS + CREATE`).
Se usan las 6 entidades mínimas del taller, en singular y `snake_case`, con `InnoDB` y `utf8mb4_unicode_ci` (tildes en `En análisis` / `En validación`).

Campos agregados:

| Tabla | Campo | Motivo |
|---|---|---|
| `historial` | `detalle` TEXT NULL | Guardar el motivo de devolución desde validación (HU-07) y datos del evento. |

Decisiones de implementación (sin desviarse del modelo mínimo):

| Tema | Decisión | Motivo |
|---|---|---|
| ENUMs | `usuario.rol`, `caso.tipo`, `caso.prioridad`, `caso.estado` como `ENUM` | Valores cerrados del taller; el resto de la validación vive en el backend. |
| `historial.estado_anterior/nuevo` | `VARCHAR(30)` NULL, no `ENUM` | Permiten registrar eventos sin transición (creación, asignación) con NULL. |
| Índices | `idx_caso_estado`, `idx_caso_usuario`, `idx_caso_prioridad` | Exigidos por la issue #4; soportan bandeja y filtros (HU-03, HU-09). |
| FK `categoria.area_id` | `RESTRICT` en borrado | Una categoría debe pertenecer a un área; no se borra un área con categorías. |
| FK `caso.agente_id` | `SET NULL` en borrado | El caso sobrevive si se desactiva/elimina el agente. |
| FK `atencion/historial.caso_id` | `CASCADE` en borrado | Son dependientes del caso; sin caso no tienen sentido. |
| `correo` / `area.nombre` UNIQUE + `UNIQUE(area_id, nombre)` | Unicidad en BD | Regla del taller: una categoría pertenece a un área y no se duplica dentro de ella. |
| Fechas | `fecha_creacion/fecha/atencion` con `DEFAULT CURRENT_TIMESTAMP`; `fecha_asignacion/cierre` NULL | Trazabilidad para métricas Lead/Cycle Time; la asignación y el cierre los pone el flujo. |

## D-04 · Datos semilla (2026-10-05 · Issue #5)

Implementado en `db/seeds.sql`. Se ejecuta después del esquema: `mysql < db/schema.sql && mysql < db/seeds.sql`. Limpia con `TRUNCATE` (con `FOREIGN_KEY_CHECKS = 0/1`) para ser re-ejecutable en desarrollo.

| Dato | Contenido | Motivo |
|---|---|---|
| 5 áreas | Las del taller, con `id` 1–5 | Base de clasificación obligatoria. |
| 16 categorías | Las del taller (`id` 1–16), cada una con su `area_id` | Cubren Hardware (4), Software (3), Red (3), Cuentas (4) y Plataformas (2). |
| 6 usuarios (`id` 1–6) | Laura y Carlos (solicitantes), Diego y María (agentes), Pedro (validador), Ana (administradora) | Un usuario por rol para probar el flujo + 2 de reserva en los roles con más carga. Correos `@universidad.edu.co`. |
| 6 casos (`id` 1–6) | Pendiente (1), En análisis (2), En atención (3), En validación (4), Cerrada (5–6) | Uno por estado + un Cerrado extra; mezclan Incidente/Solicitud, P1/P2/P3 y las 5 áreas para probar bandeja, filtros e indicadores. |
| Atenciones + historial | Caso 3 en curso sin solución; casos 4–6 con solución; 17 eventos (uno por transición) | Permiten demostrar el flujo completo y calcular tiempos de atención. |
