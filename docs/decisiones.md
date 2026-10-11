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

## D-07 · Frontend TypeScript + Tailwind + contexto de usuario (2026-10-06 · Issue #8)

**Contexto:** el scaffold inicial (#8) dejó `API_URL` sin `.env.example`, el usuario en `useState` local de `MainLayout` y menú por rol desalineado con HU-07/HU-09/HU-10/HU-11.

| Decisión | Motivo |
|---|---|
| TypeScript en frontend (`.tsx`, `client.ts` tipado) | El template Vite ya lo trae; tipos `Usuario/Area/Categoria` evitan el `@ts-expect-error` y detectan errores de `rol`/`area_id` en compilación. Backend sigue en JS, el contrato es JSON. |
| Tailwind CSS v4 vía `@tailwindcss/vite` + `@import "tailwindcss"` | Utilidades en clases (`bg-slate-50`, `rounded-2xl`) sin CSS manual; coherente con el layout existente. |
| `frontend/.env.example` con `VITE_API_URL=http://localhost:3000` + fallback `|| "http://localhost:3000"` en `src/api/client.ts` | Sin el example, `import.meta.env.VITE_API_URL` queda `undefined` y el fetch va a `undefined/api/...`. El fallback permite clonar y correr sin `.env`. |
| `src/api/client.ts` con `URLSearchParams` | Query params (`?rol=`, `?area_id=`) construidos de forma segura; reemplaza `src/services/api.js`. |
| `src/context/UsuarioContext.tsx` + `useUsuario() { usuario, usuarios, setUsuario }` con `localStorage campushelp_usuario_id` | HU-01 necesita `usuario_id` y HU-02 filtrar por él; el contexto lo expone a todas las páginas. Persistir el `id` sobrevive al recargar. |
| Menú estricto por rol: solicitante `HU-01/HU-02`, agente `HU-03`, validador `HU-07`, administrador `HU-09/HU-10/HU-11` | Refleja los actores del taller; HU-10 es solo administrador, por eso validador no ve dashboard sino `Por validar`. Rutas inexistentes como placeholder. |
| Sin menú cuando no hay usuario | No exponer rutas de otros roles si la carga de usuarios falla. |
| Limpieza Vite: fuera `App.css`, `src/assets/`, `README` genérico, `frontend/.gitkeep`; `index.html` `lang="es"` + `<title>CampusHelp</title>` | Restos de plantilla que no aportan al MVP y confunden la demo. |

## D-08 · Refinamiento del Sprint 1 (2026-10-08 · Issue #10)

Las fichas de cada historia están en `docs/historias/HU-01.md`, `HU-02.md`, `HU-03.md` y `HU-05.md`. La matriz de trazabilidad está en `docs/trazabilidad.md`.

| Decisión | Motivo |
|---|---|
| Catálogo de eventos de `historial` en minúsculas y `snake_case`: `creacion`, `asignacion`, `cambio_estado`, `envio_validacion`, `devolucion`, `cierre` | Es el que ya usa `seeds.sql`. Un solo vocabulario permite filtrar el historial (HU-08) y calcular tiempos sin traducir valores. Reemplaza el `CREADO` del CLAUDE.md. |
| Un solo `GET /api/casos` con filtros combinables (`usuario_id`, `bandeja=1` y luego los de HU-09) y la misma forma de fila: nombres de área, categoría, solicitante y agente | Sirve a HU-02, 03 y 09 con una sola consulta parametrizada y un solo tipo en el frontend. |
| `bandeja=1`: todos los casos no `Cerrada`, ordenados por prioridad y luego por antigüedad | "Pendientes" significa trabajo abierto, no solo el estado `Pendiente`. |
| `POST /api/casos` recibe `usuario_id` y el backend exige que exista, esté activo y tenga rol **`solicitante`** (solo el solicitante registra casos) | Con la autenticación simulada (D-02) el rol solo se puede comprobar así. Otro rol o un usuario inválido devuelve 400. |
| `PATCH /api/casos/:id/estado` recibe `usuario_id` y el backend exige que exista, esté activo y tenga rol **`agente`** | Mismo motivo. Otro rol o un usuario inválido devuelve 400. |
| Un error de validación responde `400` con `error: "Datos inválidos"` (texto fijo) y un elemento en `detalles` por cada fallo | El frontend muestra la lista de `detalles` sin depender del texto de `error`. Así backend y frontend no tienen que coordinar mensajes. |
| Área y categoría inactivas se rechazan al registrar | Coherente con D-06 y con HU-11. |
| El endpoint genérico de estado solo avanza un paso; `Cerrada` y la devolución se rechazan con 409 y quedan para HU-07 | La devolución exige motivo y validador. Cerrar solo por validación es una regla del taller. |
| Pasar al mismo estado → 409 | No es una transición del mapa. |
| Los controles de estado (#33) van en las filas de la bandeja durante el Sprint 1 | `GET /api/casos/:id` (detalle) es de HU-12, en el Sprint 3. |

**Pendiente para el refinement del Sprint 2:** en `seeds.sql`, los eventos `asignacion` de los casos 4, 5 y 6 pasan de `Pendiente` a `En atención`, algo que el mapa de estados no permite. Cuando se decida si asignarse un caso lo mueve a `En análisis` (HU-04), hay que alinear los seeds con el mapa.

## D-09 · POST /api/casos – registro HU-01 (Issue #23)

Contrato: `POST /api/casos` con `{ tipo, titulo, descripcion, prioridad, usuario_id, categoria_id, area_id }` → `201` con el caso creado (incluye `id`, `estado: 'Pendiente'` y `fecha_creacion` automática).

| Decisión | Motivo |
|---|---|
| `area_id` obligatorio y cruce categoría ∈ área | El taller exige área obligatoria; el formulario envía área + categoría y el backend lo verifica (R1 de HU-01). |
| Solo rol **`solicitante`** puede registrar (RN-04, R3 de HU-01) | Otro rol, usuario inexistente o inactivo → `400`. Definido en D-08 tras la revisión del #53. |
| `400` con `error: "Datos inválidos"` fijo y un elemento en `detalles` por fallo | Texto oficial (R5 de HU-01, D-08); el frontend muestra la lista sin depender del texto. |
| Referencias inexistentes/inactivas → `400`, no `404` | Son errores del cuerpo enviado; `404` queda para rutas. |
| `descripcion` con `trim` y mínimo 10 | Regla HU-01; el `trim` evita que 10 espacios pasen la validación. |
| `INSERT` caso + `INSERT` historial (`creacion`, `NULL → Pendiente`) en transacción | Si el historial falla, el caso se revierte: nunca quedan casos sin evento (CP-01/CP-04). |
| `evento: 'creacion'` en minúsculas | Vocabulario único de D-08, igual que los seeds (D-04). |

## D-10 · GET /api/casos – listado HU-02 reutilizable (Issue #26)

Un solo endpoint con filtros combinables (`AND`) para HU-02 (`?usuario_id=`), HU-03 (`bandeja=1`, issue #29) y HU-09 (filtros de estado/tipo/área/categoría/prioridad). Forma de fila exacta de la ficha HU-02.

| Decisión | Motivo |
|---|---|
| `JOIN` a categoría, área, solicitante y `LEFT JOIN` al agente | La fila trae `area`, `categoria`, `solicitante` y `agente` (`null` si no hay asignado); una sola consulta, sin N+1. |
| `usuario_id` presente pero inválido → `400`; ausente → sin filtro | La ficha HU-02 exige `400` con entero no positivo; ausente no filtra para que `bandeja=1` funcione sin usuario. |
| `usuario_id` válido sin casos (o inexistente) → `200 []` | Semántica de filtro, igual que D-06; el frontend muestra el estado vacío (E2). |
| Orden `fecha_creacion DESC, id DESC` | Lo más reciente primero (E4); el `id` desempata fechas iguales. |
| Se muestran todos los estados, incluido `Cerrada` | Regla 4 de HU-02; el estado siempre se lee de MySQL en cada carga. |

## D-11 · Bandeja del agente – ?bandeja=1 (Issue #29)

`GET /api/casos?bandeja=1` sobre el mismo SELECT de D-10, combinable con `usuario_id` y los futuros filtros HU-09.

| Decisión | Motivo |
|---|---|
| `estado <> 'Cerrada'` como condición AND | "Pendientes" son todos los no cerrados (R1 de HU-03); se combina con el resto de filtros. |
| Orden `prioridad ASC, fecha_creacion ASC, id ASC` | P1 → P3 y el más antiguo primero (E1, E4); el `ENUM('P1','P2','P3')` ya ordena así por posición. |
| Solo el valor `1` activa la bandeja; otro valor se ignora | Excepción de la ficha HU-03: `?bandeja=0` se comporta como listado general. |
| Sin restricción por rol en el backend | Regla 4 de HU-03: con autenticación simulada la restricción vive en el menú del frontend. |

## D-12 · SET NAMES utf8mb4 en scripts SQL (DEF-01 · Issue #56)

| Decisión | Motivo |
|---|---|
| `SET NAMES utf8mb4;` como primera sentencia de `db/schema.sql` y `db/seeds.sql` | El cliente `mysql` en Windows negocia cp850 y corrompe tildes, incluidos los valores del `ENUM caso.estado`; con la sentencia el archivo se auto-protege sin depender de flags. |
| Verificado por bytes, no a ojo: `HEX('Gómez')` debe ser `…47C3B36D…` y el `ENUM` mostrar tildes | Así se detectó (E2 94 9C en vez de C3 B3) y así se comprobó el arreglo + una transición a `En análisis` (CP-04). |
| El hint `--default-character-set=utf8mb4` para el README queda en la #39 | Esa issue documenta instalación/ejecución; no se pisa su alcance. |

## D-13 · PATCH estado con máquina única (Issue #32)

`PATCH /api/casos/:id/estado` con `{ estado, usuario_id, detalle? }` → `200` con el caso actualizado.

| Decisión | Motivo |
|---|---|
| Mapa en `services/estados.js` (`TRANSICIONES`), exportado para HU-04/06/07 | Una sola fuente de verdad; el genérico solo avanza un paso, `Cerrada` y devolución quedan a HU-07. |
| Lógica en `estados.js`, sin tocar `casoService.js` | Evita choques con la rama #29, que edita ese archivo. |
| `SELECT … FOR UPDATE` + `UPDATE` + `INSERT historial` en transacción | Dos cambios simultáneos no se pisan (regla 7 de HU-05); `cambio_estado` con anterior/nuevo/usuario/detalle. |
| Solo rol **`agente`** (D-08); `detalle` opcional | Quien avanza el caso es el agente; el motivo queda para la devolución de HU-07. |
| Mismo estado, salto de pasos, `Cerrada` o devolver → `409` con transiciones permitidas en `detalles` | El frontend dibuja solo los botones válidos (E5) y explica cada rechazo (CP-05). |
| Caso inexistente → `404`; cuerpo inválido → `400 Datos inválidos` | Respeta la tabla de excepciones de HU-05. |
| Sin tocar `fecha_asignacion/cierre` aquí | El cierre solo llega por validación (RN-13, HU-07, Sprint 2). |

## D-14 · Asignarse un caso lo pasa a En análisis (HU-04 · Sprint 2 Planning, 2026-10-10)

| Decisión | Motivo |
|---|---|
| Si el caso está `Pendiente`, `PATCH /api/casos/:id/asignar` guarda `agente_id` y `fecha_asignacion` y lo pasa a `En análisis` | Asignarse es tomar el caso: el agente empieza a analizarlo sin un clic extra. |
| Si el caso ya está `En análisis` sin agente, solo se asigna y el estado no cambia | No se salta ningún paso de la máquina de estados (D-13). |
| Un solo evento `asignacion` en `historial`, con `estado_anterior` y `estado_nuevo`, en la misma transacción que el `UPDATE` | RN-10: toda asignación o cambio de estado deja historial. |
| Los eventos `asignacion` de los casos 4, 5 y 6 en `seeds.sql` se corrigen a `Pendiente → En análisis`, seguidos de los `cambio_estado` que llevan a su estado actual | Hoy saltan de `Pendiente` a `En atención`, una transición que el mapa no permite (observación de HU-05). Lo hace el BACK de HU-04 (#69). |
