# Casos de prueba

Registro de la ejecución real de los casos de prueba del taller. Cada caso indica fecha, versión probada, pasos, resultado esperado, resultado obtenido, evidencia y estado.

- **Estados:** ✅ Pasa · ❌ Falla (se abre un defecto con label `defecto`) · ⏳ Pendiente.
- **Evidencias:** capturas en `docs/evidencias/pruebas/`.
- Los casos propios (CP-11 en adelante) y el registro consolidado de defectos se completan en la #38.

## Resumen

| CP | Caso | HU | Fecha | Estado |
|---|---|---|---|---|
| CP-01 | Registrar incidente válido | HU-01 | 2026-10-09 | ✅ Pasa |
| CP-02 | Registrar sin descripción | HU-01 | 2026-10-09 | ✅ Pasa |
| CP-03 | Registrar solicitud de servicio | HU-01 | 2026-10-09 | ✅ Pasa |
| CP-04 | Cambio de estado válido | HU-05 | — | ⏳ Pendiente (#34) |
| CP-05 | Transición inválida | HU-05 | — | ⏳ Pendiente (#34) |
| CP-06 | Asignar agente | HU-04 | — | ⏳ Pendiente (Sprint 2) |
| CP-07 | Registrar diagnóstico y solución | HU-06 | — | ⏳ Pendiente (Sprint 2) |
| CP-08 | Devolver desde validación | HU-07 | — | ⏳ Pendiente (Sprint 2) |
| CP-09 | Cerrar caso aprobado | HU-07 | — | ⏳ Pendiente (Sprint 2) |
| CP-10 | Filtrar por tipo, área y prioridad | HU-09 | — | ⏳ Pendiente (Sprint 3) |

Las HU que no tienen un CP obligatorio propio se prueban con sus escenarios de aceptación:

| HU | Escenarios | Issue | Fecha | Estado |
|---|---|---|---|---|
| HU-02 · Consultar mis casos | E1, E2, E3, E4 y excepciones | #28 | 2026-10-10 | ✅ Pasa |
| HU-03 · Bandeja de casos pendientes | E1, E2, E3, E4, regla 4 y excepciones | #31 | 2026-10-10 | ✅ Pasa |

---

## HU-01 · Registrar incidente o solicitud (#25)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-09 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `050e1d8` (incluye #23, #24 y la corrección de DEF-01, #56) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` cargados **sin** `--default-character-set` (6 casos y 17 registros de historial al inicio) |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/crear-caso`, usuario de prueba **Laura Gómez** (id 1, solicitante) |

### CP-01 · Registrar incidente válido (E1) ✅

**Pasos**
1. En `/crear-caso`, con Laura Gómez, elegir tipo **Incidente**, área **Red y conectividad**, categoría **Wi-Fi** y prioridad **P1**.
2. Título: `QA CP-01 Sin Wi-Fi en la biblioteca`. Descripción: `No conecta a la red institucional desde las 8:00 en el segundo piso.`
3. Pulsar **Registrar caso**.
4. Consultar la fila en MySQL y `GET /api/casos?bandeja=1`.

**Esperado:** se crea con un ID, queda persistido y aparece en la bandeja como `Pendiente`.

**Obtenido**
- La pantalla muestra "¡Caso #7 registrado con éxito!".
- En MySQL:

  ```text
  id  tipo       titulo                               prioridad  estado     usuario_id  categoria_id  agente_id  fecha_creacion
  7   Incidente  QA CP-01 Sin Wi-Fi en la biblioteca  P1         Pendiente  1           8             NULL       2026-10-09 12:34:08
  ```

- `GET /api/casos?bandeja=1` devuelve `[3, 1, 7, 4, 2]`: el caso 7 aparece como `Pendiente`, con `agente: null`, después de los P1 más antiguos (3 y 1).
- La pantalla de la bandeja (#30) todavía no está fusionada, así que la presencia en la bandeja se verificó por la API.

**Evidencia:** [`cp01-registro-ui.jpg`](../evidencias/pruebas/cp01-registro-ui.jpg)

### CP-02 · Registrar sin descripción (E2) ✅

**Pasos**
1. **UI:** área Hardware, categoría Proyector, título `QA CP-02 Descripcion corta` y descripción `No sirve` (8 caracteres).
2. **API:** `POST /api/casos` con datos válidos salvo la descripción, en tres variantes: sin el campo, con `No sirve.` (9 caracteres) y con `"     abc         "` (3 caracteres después de quitar espacios).
3. Contar las filas de `caso` e `historial` antes y después.

**Esperado:** se rechaza el registro con un mensaje y no se crea ninguna fila.

**Obtenido**
- **UI:** aparece "La descripción debe tener al menos 10 caracteres." bajo el campo, que queda en rojo, y el botón **Registrar caso** queda deshabilitado (`disabled = true`).
- **API:** las tres variantes responden:

  ```json
  HTTP 400
  { "error": "Datos inválidos", "detalles": ["Descripción mínima de 10 caracteres."] }
  ```

- No se crean filas. Después de CP-01 había 7 casos y 18 registros de historial. Las peticiones rechazadas (CP-02, E4, R3 y la de varios campos) se ejecutaron en una tanda que terminó con una sola petición válida (caso 8, ver *El cliente no fija el estado*). Al final de la tanda había 8 casos y 19 registros: solo se sumó la fila de esa petición válida.

**Evidencia:** [`cp02-descripcion-corta-ui.jpg`](../evidencias/pruebas/cp02-descripcion-corta-ui.jpg)

### CP-03 · Registrar solicitud de servicio (E3) ✅

**Pasos**
1. En `/crear-caso`, con Laura Gómez, elegir tipo **Solicitud de servicio**, área **Software**, categoría **Instalación** y prioridad **P3**.
2. Título: `QA CP-03 Instalar MATLAB en sala 204`. Descripción: `Se necesita instalar MATLAB en los 20 equipos de la sala 204 para el curso de métodos numéricos.`
3. Pulsar **Registrar caso** y consultar MySQL.

**Esperado:** el caso queda almacenado con tipo `Solicitud`.

**Obtenido**
- La pantalla muestra "¡Caso #9 registrado con éxito!".
- En MySQL:

  ```text
  id  tipo       titulo                                prioridad  estado     usuario_id  categoria    area
  9   Solicitud  QA CP-03 Instalar MATLAB en sala 204  P3         Pendiente  1           Instalación  Software
  ```

**Evidencia:** [`cp03-solicitud-ui.jpg`](../evidencias/pruebas/cp03-solicitud-ui.jpg)

### Otros criterios de HU-01

| Criterio | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| **E4** · Categoría de otra área | `POST /api/casos` con `area_id: 1` (Hardware) y `categoria_id: 8` (Wi-Fi) | Se rechaza | `400` · `detalles: ["La categoría no pertenece al área indicada."]`. No se crean filas. | ✅ |
| **E5** · Prueba de reinicio | Detener el backend y MySQL (`mysqladmin shutdown`) y arrancar los dos de nuevo. Consultar `GET /api/casos?usuario_id=1` y MySQL. | Los casos siguen existiendo | MySQL arrancó de nuevo (`Uptime` = 7 s) y `/api/health` respondió `db: up`. La API devuelve los casos 7, 8 y 9 con sus datos, y MySQL conserva 9 casos y 20 registros de historial, los mismos que antes del reinicio. | ✅ |
| **E6** · Evento `creacion` en el historial | Consultar `historial` de los casos 7, 8 y 9 | `creacion`, `NULL → Pendiente`, `usuario_id` del solicitante | Cada caso tiene una fila `creacion`, `NULL → Pendiente`, `usuario_id = 1`. `GET /api/casos/:id/historial` es de HU-08 (Sprint 2), así que se verificó en MySQL. | ✅ |

### Verificaciones adicionales (candidatas a CP propios en la #38)

| Verificación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| Solo el solicitante registra (R3) | `POST /api/casos` con `usuario_id: 3` (Diego Torres, agente) | `400` | `400` · `detalles: ["Solo un usuario con rol solicitante puede registrar casos."]`. No se crean filas. | ✅ |
| Un mensaje por campo inválido | `POST` con `tipo: "Otro"`, título vacío, descripción `corta` y `prioridad: "P9"` | `400` con un elemento en `detalles` por campo | `400` con 4 elementos: tipo, título, descripción y prioridad. | ✅ |
| El cliente no fija el estado (regla 7) | `POST` válido con `"estado": "Cerrada"` | El caso se crea como `Pendiente` | `201`, caso 8 con `estado: "Pendiente"` y su evento `creacion`. | ✅ |

### Conclusión

HU-01 cumple E1 a E6 y no tiene defectos abiertos. No se registraron defectos nuevos en esta ejecución. DEF-01 (#56), el defecto de codificación de los scripts SQL, se cerró antes de ejecutar estas pruebas: la base se cargó sin `--default-character-set` y los textos con tildes quedaron bien.

**Pendiente fuera de HU-01:** la presencia en la pantalla de la bandeja se comprobó en la #31 (ver HU-03 · E3) el 2026-10-10. ✅

---

## HU-02 · Consultar mis casos (#28)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-10 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `ea85117` (incluye #26, #27, #32 y #30) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos y 17 registros de historial al inicio). Para E2 se agregó un usuario de prueba **QA Sin Casos** (id 7, solicitante) solo en esta base. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/mis-solicitudes` ("Mis Casos" en el menú) · `npm run build` sin errores |

Con los seeds, **Laura Gómez** (id 1) tiene los casos 1, 3 y 5, y **Carlos Ruiz** (id 2) los casos 2, 4 y 6.

### E1 · Solo ve sus casos con su estado actual ✅

**Pasos**
1. Elegir a Laura Gómez en el selector y abrir **Mis Casos**.
2. Cambiar a Carlos Ruiz.
3. Comparar con `GET /api/casos?usuario_id=1` y `?usuario_id=2`.

**Esperado:** cada solicitante ve solo sus casos, con el estado guardado en MySQL.

**Obtenido**
- **Laura:** `#1 Pendiente`, `#3 En atención` y `#5 Cerrada`. No aparece ningún caso de Carlos.
- **Carlos:** `#2 En análisis`, `#6 Cerrada` y `#4 En validación`. No aparece ningún caso de Laura.
- La API devuelve los mismos casos con los mismos estados.
- Se muestran los casos `Cerrada` (R2) y las columnas ID, título, tipo, área / categoría, prioridad, estado y fecha.

**Evidencia:** [`hu02-e1-laura.jpg`](../evidencias/pruebas/hu02-e1-laura.jpg)

### E2 · Solicitante sin casos ✅

**Pasos**
1. Elegir a **QA Sin Casos** (id 7) en el selector, con la vista abierta.
2. Consultar `GET /api/casos?usuario_id=7`.

**Esperado:** un mensaje de lista vacía.

**Obtenido**
- La vista muestra "Aún no tienes casos registrados." y un botón **Registrar caso** que lleva a `/crear-caso`.
- La API responde `200 []`.

**Evidencia:** [`hu02-e2-sin-casos.jpg`](../evidencias/pruebas/hu02-e2-sin-casos.jpg)

### E3 · Estado actualizado tras un cambio del agente ✅

**Pasos**
1. Como Diego Torres (id 3, agente), `PATCH /api/casos/1/estado` con `{"estado": "En análisis", "usuario_id": 3}`. Los controles de estado de la bandeja (#33) todavía no están fusionados, así que el cambio se hizo por la API.
2. Recargar **Mis Casos** con Laura Gómez.

**Esperado:** Laura ve el estado nuevo del caso #1.

**Obtenido**
- La API responde `200` con `estado: "En análisis"`.
- En MySQL, el caso 1 queda `En análisis` y el historial suma la fila `cambio_estado`, `Pendiente → En análisis`, `usuario_id = 3`.
- Al recargar, la fila #1 muestra **En análisis**.

**Evidencia:** [`hu02-e3-estado-actualizado.jpg`](../evidencias/pruebas/hu02-e3-estado-actualizado.jpg)

### E4 · El más reciente aparece primero ✅

**Pasos**
1. Registrar un caso nuevo para Laura con `POST /api/casos`: tipo Solicitud, área Cuentas y acceso, categoría Bloqueo, prioridad P3, título `QA HU-02 Restablecer contraseña`.
2. Recargar **Mis Casos** con Laura Gómez.

**Esperado:** los casos aparecen del más reciente al más antiguo.

**Obtenido**
- El `POST` responde `201` con el caso 7.
- La vista muestra `#7` (10/10/26, 8:51 a. m.), `#1` (6/10/26, 9:00 a. m.), `#3` (5/10/26, 11:00 a. m.) y `#5` (5/10/26, 8:00 a. m.).
- `GET /api/casos?usuario_id=2` sigue devolviendo solo 2, 6 y 4: el caso nuevo no aparece para Carlos.

**Evidencia:** [`hu02-e4-orden.jpg`](../evidencias/pruebas/hu02-e4-orden.jpg)

### Excepciones de HU-02

| Situación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| `usuario_id` no es un entero positivo | `GET /api/casos?usuario_id=` con `abc`, `0`, `-1` y `1.5` | `400` | Las cuatro responden `400` · `{"error": "Datos inválidos", "detalles": ["usuario_id debe ser un entero positivo."]}` | ✅ |
| `usuario_id` válido pero inexistente | `GET /api/casos?usuario_id=999` | `200 []` | `200 []` | ✅ |
| La API cae con la vista abierta | Cargar la vista con Laura, detener el backend y cambiar a Carlos en el selector | Mensaje de error, no lista vacía | Tras unos segundos en "Cargando tus casos…", aparece el banner "No se pudieron cargar tus casos. Intenta de nuevo." | ✅ |
| La API está caída al abrir la aplicación | Detener el backend y recargar `/mis-solicitudes` | Mensaje de error, no lista vacía | El encabezado muestra "No se pudieron cargar los usuarios" y la vista dice "No hay usuario activo para mostrar casos." No se muestra una lista vacía. | ✅ |

**Evidencia:** [`hu02-api-caida.jpg`](../evidencias/pruebas/hu02-api-caida.jpg)

### Prueba de reinicio

Se detuvieron MySQL (`mysqladmin shutdown`) y el backend, y se arrancaron de nuevo (`Uptime` = 1 s, `/api/health` → `db: up`). `GET /api/casos?usuario_id=1` devuelve `7 Pendiente`, `1 En análisis`, `3 En atención` y `5 Cerrada`. MySQL conserva 7 casos y 19 registros de historial (17 de los seeds, más el cambio de E3 y la creación de E4). ✅

### Observaciones

- **Columna del agente asignado (regla 2):** la vista no la muestra. Se acordó en la revisión del PR #62 dejarla para HU-12. La API ya devuelve `agente` en cada fila. No se registra como defecto.
- **Título de la pantalla:** el `<h2>` dice "Mis Solicitudes" y el menú dice "Mis Casos". Es una sugerencia de la revisión del PR #62, no un defecto.

### Conclusión

HU-02 cumple E1 a E4 y sus excepciones, y no se registraron defectos. Candidatos a casos propios en la #38: aislamiento entre solicitantes (E1), lista vacía (E2) y error de la API en la vista (excepción 3).

---

## HU-03 · Bandeja de casos pendientes (#31)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-10 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `ea85117` (incluye #29 y #30) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos y 17 registros de historial al inicio). Para E1 se insertó por SQL, solo en esta base, el caso 7: **P3**, Solicitud, Software / Actualización, de Carlos Ruiz, `Pendiente`, con `fecha_creacion` = `2026-10-01 08:00:00` y su evento `creacion` en el historial. Se insertó por SQL porque la API fija la fecha de creación y no permite crear un caso antiguo. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/bandeja-soporte` ("Bandeja" en el menú), usuario de prueba **Diego Torres** (id 3, agente) |

Con los seeds, los casos abiertos son `#1` (P1, 6 oct), `#3` (P1, 5 oct), `#2` (P2, 6 oct) y `#4` (P2, 5 oct). Los casos `#5` y `#6` están `Cerrada`.

### E3 · Un caso recién registrado aparece Pendiente y "Sin asignar" ✅

**Pasos**
1. En `/crear-caso`, con Laura Gómez, registrar un **Incidente** de **Hardware / Proyector**, prioridad **P1**, título `QA HU-03 Proyector del auditorio sin imagen`.
2. Cambiar a Diego Torres y abrir **Bandeja**.

**Esperado:** el caso nuevo aparece en estado `Pendiente` y con agente "Sin asignar".

**Obtenido**
- La pantalla muestra "¡Caso #8 registrado con éxito!".
- En MySQL, el caso 8 queda `Pendiente`, con `agente_id = NULL` y `fecha_creacion = 2026-10-10 08:57:41`. El historial suma la fila `creacion`, `NULL → Pendiente`, `usuario_id = 1`.
- En la bandeja, la fila `#8` muestra **Pendiente** y **Sin asignar**.

Con esto queda comprobado el pendiente de CP-01: un caso registrado desde la interfaz aparece en la pantalla de la bandeja.

**Evidencia:** [`hu03-bandeja-orden.jpg`](../evidencias/pruebas/hu03-bandeja-orden.jpg) (la misma captura de E1, E2 y E4)

### E1 · Un P1 reciente aparece antes que un P3 antiguo ✅

**Pasos**
1. Con el caso 7 (P3, 1 oct) y el caso 8 (P1, 10 oct), abrir **Bandeja** con Diego Torres.
2. Comparar con `GET /api/casos?bandeja=1`.

**Esperado:** el P1 aparece primero, aunque sea más reciente.

**Obtenido**
- La bandeja muestra `#3, #1, #8, #4, #2, #7`. El caso `#8` (P1, 10 oct) aparece antes que el `#7` (P3, 1 oct), que queda al final.
- La API devuelve el mismo orden.
- Se muestran las 9 columnas de la regla 2: ID, título, tipo, área / categoría, solicitante, prioridad, estado, agente y fecha. Las filas P1 tienen un borde rojo.

**Evidencia:** [`hu03-bandeja-orden.jpg`](../evidencias/pruebas/hu03-bandeja-orden.jpg)

### E2 · Los casos Cerrada no aparecen ✅

**Pasos**
1. Abrir **Bandeja** con Diego Torres.
2. Comparar con `GET /api/casos?bandeja=1`.

**Esperado:** los casos `Cerrada` no aparecen.

**Obtenido:** ni la pantalla ni la API incluyen los casos `#5` y `#6`, que están `Cerrada`. Aparecen los otros 6 casos, en los estados `Pendiente`, `En análisis`, `En atención` y `En validación`.

**Evidencia:** [`hu03-bandeja-orden.jpg`](../evidencias/pruebas/hu03-bandeja-orden.jpg)

### E4 · Entre dos P1, el más antiguo aparece primero ✅

**Pasos**
1. Abrir **Bandeja** con Diego Torres y comparar los casos P1.

**Esperado:** el P1 más antiguo aparece primero.

**Obtenido**
- Entre los P1, el orden es `#3` (5 oct), `#1` (6 oct) y `#8` (10 oct).
- Entre los P2, el orden es `#4` (5 oct) y `#2` (6 oct).

**Evidencia:** [`hu03-bandeja-orden.jpg`](../evidencias/pruebas/hu03-bandeja-orden.jpg)

### Regla 4 · La bandeja solo está en el menú del agente ✅

| Usuario | Rol | Menú |
|---|---|---|
| Diego Torres y María Prieto | Agente | `/bandeja-soporte` |
| Laura Gómez | Solicitante | `/crear-caso` y `/mis-solicitudes` |
| Pedro Validador | Validador | `/por-validar` |
| Ana Admin | Administrador | `/casos`, `/indicadores` y `/categorias` |

### Excepciones de HU-03

| Situación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| No hay casos abiertos | Respaldar los estados en una tabla temporal, pasar todos los casos a `Cerrada` por SQL y abrir **Bandeja** con Diego. Después se restauraron los estados y se borró la tabla temporal. | `200 []` y "No hay casos pendientes" | La API responde `200 []` y la pantalla muestra "No hay casos pendientes". | ✅ |
| `bandeja` con un valor distinto de `1` | `GET /api/casos?bandeja=` con `0`, `abc`, `true` y vacío | Se ignora y se comporta como el listado general | Las cuatro responden `200` con el listado general de 7 casos, incluidos los `Cerrada`. | ✅ |
| La API no responde | Con la bandeja cargada, detener el backend y volver a abrir la bandeja (cambio de ruta en la aplicación) | Mensaje de error | Aparece el banner "No se pudo cargar la bandeja. Intenta de nuevo." | ✅ |

**Evidencia:** [`hu03-bandeja-vacia.jpg`](../evidencias/pruebas/hu03-bandeja-vacia.jpg) · [`hu03-api-caida.jpg`](../evidencias/pruebas/hu03-api-caida.jpg)

### Prueba de reinicio

Se detuvieron MySQL (`mysqladmin shutdown`) y el backend, y se arrancaron de nuevo. `GET /api/casos?bandeja=1` devuelve el mismo orden: `#3, #1, #8, #4, #2, #7`. El caso 8 sigue `Pendiente` y sin agente. MySQL conserva 8 casos y 19 registros de historial: 17 de los seeds, más la creación del caso 7 (insertada por SQL) y la del caso 8. ✅

### Observaciones

- **La bandeja no se recarga al cambiar de agente.** Al pasar de Diego a María en el selector, la tabla no vuelve a pedir los datos. No es un defecto, porque la bandeja es la misma para todos los agentes. Por eso, en la prueba de la API caída, la bandeja se volvió a abrir con un cambio de ruta.
- **E1 necesitó un caso antiguo creado por SQL**, porque la fecha de creación es automática (regla de HU-01). Solo se hizo en la base de pruebas.

### Conclusión

HU-03 cumple E1 a E4, la regla 4 y sus excepciones, y no se registraron defectos. Queda cubierto también el pendiente de CP-01 (el caso registrado aparece en la bandeja). Candidatos a casos propios en la #38: orden por prioridad y antigüedad (E1 y E4), bandeja vacía y error de la API en la bandeja.
