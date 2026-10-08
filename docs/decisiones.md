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

## D-05 · Scaffold del backend (2026-10-05 · Issue #6)

`backend/` con Express 4 + `mysql2/promise` + `dotenv` + `cors`, en CommonJS. Estructura real: `src/db/` (pool), `src/routes/`, `src/controllers/`, `src/services/`, `src/middlewares/`, `src/app.js`, `src/server.js`.

| Decisión | Motivo |
|---|---|
| Pool único `mysql2/promise` en `src/db/pool.js` | Reutiliza conexiones; `services/` lo importan para consultas parametrizadas. |
| Capas routes → controllers → services → db | Las reglas de negocio (máquina de estados, validaciones HU) vivirán en `services/`; el frontend nunca valida. |
| `GET /api/health` con `SELECT 1` | 200 `{ status: 'ok', db: 'up' }` si la BD responde; 500 `{ error, detalles }` si no. Sirve para verificar el entorno antes de cada demo. |
| `notFound` + `errorHandler` con `{ error, detalles }` y helper `createError(status, msg, detalles)` | Formato único exigido por las convenciones; códigos 400/404/409/500 listos para los endpoints de casos. |
| `npm start` = `node src/server.js`, `npm run dev` = `node --watch` | Sin `nodemon`: Node 20 ya recarga en desarrollo y hay una dependencia menos que instalar. |
| Solo `.env.example` versionado | Los secretos nunca se suben (ver `.gitignore`); cada integrante copia a `.env`. |

## D-06 · Endpoints de catálogo (2026-10-05 · Issue #7)

`GET /api/usuarios?rol=`, `GET /api/areas` y `GET /api/categorias?area_id=`. Sostienen el formulario de registro (áreas → categorías) y el selector de usuario de prueba (D-02).

| Decisión | Motivo |
|---|---|
| Solo registros activos (`activo/activa = TRUE`) | Los desactivados no deben ofrecerse en el formulario ni en el selector. |
| `rol` validado contra el `ENUM` (400 si es inválido) | Falla rápido con `{ error, detalles }` antes de tocar la BD. |
| `area_id` entero positivo (400 si no) | Evita SQL inválido; siempre con consulta parametrizada (`?`). |
| Filtro sin coincidencias → `200 []` | Semántica de filtro, no de recurso inexistente; el frontend muestra lista vacía. |
| Sin `password`/campos sensibles en usuarios | La tabla no los tiene; se exponen `id, nombre, correo, rol` para el selector. |

## D-07 · POST /api/casos – registro HU-01 (Issue #23)

Contrato: `POST /api/casos` con `{ tipo, titulo, descripcion, prioridad, usuario_id, categoria_id, area_id }` → `201` con el caso creado (incluye `id`, `estado: 'Pendiente'` y `fecha_creacion` automática).

| Decisión | Motivo |
|---|---|
| `area_id` obligatorio y cruce categoría ∈ área | El taller exige área obligatoria; el formulario envía área + categoría y el backend lo verifica. |
| Todos los errores juntos en `400 { error, detalles: [...] }` | El formulario muestra todo lo que falta de una vez (tipo, título, descripción, prioridad, referencias). |
| Referencias inexistentes/inactivas → `400`, no `404` | Son errores del cuerpo enviado, según pide la issue; `404` queda para rutas. |
| `descripcion` con `trim` y mínimo 10 | Regla HU-01; el `trim` evita que 10 espacios pasen la validación. |
| `INSERT` caso + `INSERT` historial (`creacion`, `NULL → Pendiente`) en transacción | Si el historial falla, el caso se revierte: nunca quedan casos sin evento (CP-01/CP-04). |
| `evento: 'creacion'` en minúsculas | Igual que los seeds (D-04) para que filtros e indicadores no distingan. |
| Cualquier `usuario` activo puede registrar | No se restringe a rol solicitante para no bloquear la demo con el selector de D-02. |
