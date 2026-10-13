# Casos de prueba

Registro de la ejecución real de los casos de prueba del taller. Cada caso indica fecha, versión probada, pasos, resultado esperado, resultado obtenido, evidencia y estado.

- **Estados:** ✅ Pasa · ❌ Falla (se abre un defecto con label `defecto`) · ⏳ Pendiente.
- **Evidencias:** capturas en `docs/evidencias/pruebas/`.
- Los casos propios (CP-11 a CP-18) y el registro consolidado de defectos están al final del documento (#38).

## Resumen

| CP | Caso | HU | Fecha | Estado |
|---|---|---|---|---|
| CP-01 | Registrar incidente válido | HU-01 | 2026-10-09 | ✅ Pasa |
| CP-02 | Registrar sin descripción | HU-01 | 2026-10-09 | ✅ Pasa |
| CP-03 | Registrar solicitud de servicio | HU-01 | 2026-10-09 | ✅ Pasa |
| CP-04 | Cambio de estado válido | HU-05 | 2026-10-10 | ✅ Pasa |
| CP-05 | Transición inválida | HU-05 | 2026-10-10 | ✅ Pasa |
| CP-06 | Asignar agente | HU-04 | 2026-10-12 | ✅ Pasa |
| CP-07 | Registrar diagnóstico y solución | HU-06 | 2026-10-12 | ✅ Pasa |
| CP-08 | Devolver desde validación | HU-07 | 2026-10-12 | ✅ Pasa |
| CP-09 | Cerrar caso aprobado | HU-07 | 2026-10-12 | ✅ Pasa |
| CP-10 | Filtrar por tipo, área y prioridad | HU-09 | 2026-10-13 | ✅ Pasa |
| CP-11 | Categoría de otra área | HU-01 | 2026-10-13 | ✅ Pasa |
| CP-12 | Un agente no asignado registra una atención | HU-06 | 2026-10-13 | ✅ Pasa |
| CP-13 | Devolución sin motivo | HU-07 | 2026-10-13 | ✅ Pasa |
| CP-14 | Un caso cerrado no cambia | HU-05 | 2026-10-13 | ✅ Pasa |
| CP-15 | Una categoría desactivada no aparece en el registro | HU-11 | 2026-10-13 | ✅ Pasa |
| CP-16 | Un solicitante no ve un caso ajeno por URL | HU-12 | 2026-10-13 | ✅ Pasa |
| CP-17 | Dos validaciones simultáneas del mismo caso | HU-07 | 2026-10-13 | ✅ Pasa |
| CP-18 | Un caso devuelto muestra todas sus atenciones en orden | HU-12 | 2026-10-13 | ✅ Pasa |

Las HU que no tienen un CP obligatorio propio se prueban con sus escenarios de aceptación:

| HU | Escenarios | Issue | Fecha | Estado |
|---|---|---|---|---|
| HU-02 · Consultar mis casos | E1, E2, E3, E4 y excepciones | #28 | 2026-10-10 | ✅ Pasa |
| HU-03 · Bandeja de casos pendientes | E1, E2, E3, E4, regla 4 y excepciones | #31 | 2026-10-10 | ✅ Pasa |
| HU-08 · Historial y flujo completo del MVP | Flujo completo con devolución, E1, E2, E3, E4 y excepciones | #80 | 2026-10-12 | ✅ Pasa |
| HU-10 · Indicadores | E1, E2, E3, R4 y excepciones | #102 | 2026-10-13 | ✅ Pasa |
| HU-11 · Gestionar categorías | E1, E2, E3, E4, E5, reglas 2 a 5 y excepciones | #105 | 2026-10-13 | ✅ Pasa |
| HU-12 · Detalle del caso | E1, E2, E3, reglas 1 a 4 y excepciones | #108 | 2026-10-13 | ✅ Pasa |

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

---

## HU-05 · Cambiar el estado del caso (#34)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-10 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `7e33ff6` (incluye #32 y #33) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos y 17 registros de historial al inicio). Para probar un agente inactivo se agregó el usuario de prueba **QA Agente Inactivo** (id 7, agente, `activo = FALSE`) solo en esta base. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/bandeja-soporte`, usuario de prueba **Diego Torres** (id 3, agente) · `npm run build` sin errores |

En cada petición rechazada se contaron las filas de `historial` y se leyó el estado de todos los casos antes y después, para comprobar que no cambió nada.

### CP-04 · Cambio de estado válido (E1) ✅

**Pasos**
1. En **Bandeja**, con Diego Torres, pulsar **Pasar a En análisis** en la fila del caso `#1` (`Pendiente`).
2. Consultar el caso y su historial en MySQL.

**Esperado:** el estado se actualiza y se crea un registro en el historial con el estado anterior y el nuevo.

**Obtenido**
- La bandeja se recarga y la fila `#1` muestra **En análisis** y el botón **Pasar a En atención**.
- En MySQL, el caso 1 queda `En análisis`.
- El historial pasa de 17 a 18 filas. La fila nueva es `id 18`, `cambio_estado`, `Pendiente → En análisis`, `usuario_id = 3`, `fecha = 2026-10-10 20:17:10`.
- **Con `detalle` (regla 7):** `PATCH /api/casos/2/estado` con `{"estado": "En atención", "usuario_id": 4, "detalle": "QA HU-05 Se revisa la licencia de Visual Studio."}` responde `200`. La fila de historial guarda el `detalle`.

**Evidencia:** [`hu05-e5-botones.jpg`](../evidencias/pruebas/hu05-e5-botones.jpg) (antes) · [`hu05-cp04-cambio.jpg`](../evidencias/pruebas/hu05-cp04-cambio.jpg) (después)

### CP-05 · Transición inválida (E2) ✅

**Pasos**
1. Registrar un caso nuevo con `POST /api/casos`: Incidente, Software / Error, P2, de Carlos Ruiz, título `QA CP-05 Error al abrir el software de laboratorio`. Queda como caso 7, `Pendiente`.
2. Como Diego, `PATCH /api/casos/7/estado` con `Cerrada`, con `En validación` y con `En atención`.
3. Revisar el caso y el historial en MySQL después de cada petición.

**Esperado:** el sistema lo impide (`409`) y no cambia nada: ni el caso ni el historial.

**Obtenido**

| Transición | Respuesta |
|---|---|
| `Pendiente → Cerrada` | `409` · "Solo se llega a Cerrada por validación (HU-07)." |
| `Pendiente → En validación` | `409` · "Transición no permitida desde Pendiente." · detalles: "Transiciones permitidas: En análisis." |
| `Pendiente → En atención` | `409` · el mismo mensaje |

Después de las tres peticiones, el caso 7 sigue `Pendiente`, tiene solo su fila `creacion` y el historial total sigue en 20 filas.

En la interfaz no hay forma de pedir una transición inválida, porque la fila de un caso `Pendiente` solo ofrece **Pasar a En análisis** (E5).

### Otros criterios de HU-05

| Criterio | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| E3 · Un caso Cerrada no cambia | `PATCH /api/casos/5/estado` a `En validación` y a `Pendiente` | `409` | `409` · "El caso está Cerrado y no puede cambiar." Sin cambios. | ✅ |
| E4 · La devolución no va por este endpoint | `PATCH /api/casos/4/estado` (`En validación`) a `En atención` | `409` e indicar que es por validación | `409` · "La devolución se hace por validación (HU-07)." Sin cambios. A `Cerrada` también responde `409`. | ✅ |
| E5 · Solo los botones permitidos | Abrir **Bandeja** con Diego | Un botón por transición permitida | `Pendiente` → "Pasar a En análisis", `En análisis` → "Pasar a En atención", `En atención` → "Pasar a En validación" y `En validación` → "Sin acciones". | ✅ |
| Regla 5 · Mismo estado | Caso 2 (`En análisis`) a `En análisis` | `409` | `409` · "El caso ya está en estado En análisis." Sin cambios. | ✅ |
| Regla 2 · No se retrocede | Caso 3 (`En atención`) a `Pendiente` | `409` | `409` · "Transición no permitida desde En atención." Sin cambios. | ✅ |
| Regla 7 · Dos cambios simultáneos | Dos `PATCH /api/casos/1/estado` a `En atención` en paralelo, de Diego y de María | Solo uno se aplica | Uno responde `200` y el otro `409` ("El caso ya está en estado En atención."). Se crea **una** sola fila de historial. | ✅ |
| Error del backend en la interfaz | Con la bandeja abierta, otro agente pasa el caso 7 a `En análisis` por la API. Después, Diego pulsa el botón viejo **Pasar a En análisis**. | Se muestra el `error` del backend y la fila se recarga | La fila muestra "El caso ya está en estado En análisis. Transiciones permitidas: En atención." y se recarga con el estado real y el botón **Pasar a En atención**. | ✅ |

**Evidencia:** [`hu05-error-backend.jpg`](../evidencias/pruebas/hu05-error-backend.jpg)

### Excepciones de HU-05

Todas se ejecutaron con `PATCH /api/casos/:id/estado`, y en ninguna cambió el caso ni el historial.

| Situación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| El caso no existe | `id = 999` | `404` | `404` · "Caso no encontrado" | ✅ |
| `id` no es un entero | `id = abc` | `400` | `400` · "El id del caso debe ser un entero positivo." | ✅ |
| Falta `estado` | Cuerpo sin `estado` | `400` | `400` · "Estado inválido. Valores permitidos: …" | ✅ |
| `estado` no es uno de los 5 valores | `"estado": "Resuelto"` | `400` | `400` · el mismo mensaje | ✅ |
| El usuario no es agente | `usuario_id` 1 (solicitante) y 5 (validador) | `400` | `400` · "Solo un usuario con rol agente puede cambiar el estado." | ✅ |
| El usuario no existe | `usuario_id = 99` | `400` | `400` · "El usuario indicado no existe." | ✅ |
| El usuario está inactivo | `usuario_id = 7` (QA Agente Inactivo) | `400` | `400` · "El usuario indicado está inactivo." | ✅ |
| Falta `usuario_id` | Cuerpo sin `usuario_id` | `400` | `400` · "usuario_id debe ser un entero positivo." | ✅ |
| Error de la base de datos | — | `500` y *rollback* | **No se ejecutó:** provocar una falla de MySQL a mitad de la transacción requiere modificar el código. Se revisó en el código: `services/estados.js` hace `rollback` en el `catch` y responde `500`. | ⏳ |

### Prueba de reinicio

Se detuvieron MySQL (`mysqladmin shutdown`) y el backend, y se arrancaron de nuevo (`/api/health` → `db: up`). `GET /api/casos?bandeja=1` devuelve `3 En atención`, `1 En atención`, `4 En validación`, `2 En atención` y `7 En análisis`, los mismos estados que antes del reinicio. MySQL conserva 7 casos y 22 registros de historial: 17 de los seeds, la creación del caso 7 y 4 cambios de estado. ✅

### Observaciones

- **Formato del mensaje de 409:** la ficha de HU-05 da como ejemplo "Transición no permitida: Pendiente → Cerrada". El backend responde "Transición no permitida desde Pendiente." y pone las transiciones permitidas en `detalles`. El contenido cumple la tabla de excepciones, así que no se registra como defecto.
- **La ruta `/bandeja-soporte` no está protegida por rol:** un solicitante puede abrirla escribiendo la URL. La pantalla avisa que solo un agente puede cambiar el estado y el backend rechaza el cambio con `400`, así que la regla de negocio se cumple. Se anotó como sugerencia en la revisión del PR #66.
- **Pendiente para el Sprint 2 (regla 8):** todavía no se exige un agente asignado para pasar a `En atención` (el caso 1 pasó sin agente) ni una atención con solución para pasar a `En validación`. Es lo acordado para el Sprint 1.
- **Seeds incoherentes con la máquina de estados:** los casos 4, 5 y 6 tienen eventos `asignacion` de `Pendiente → En atención`, un salto que el endpoint no permite. Ya está anotado en la ficha de HU-05 y se resuelve al definir HU-04.

### Conclusión

HU-05 cumple CP-04, CP-05, E3 a E5 y sus excepciones, y no se registraron defectos. Solo quedó sin ejecutar la excepción de error de la base de datos, que se revisó en el código. Candidatos a casos propios en la #38: cambio con `detalle`, agente inactivo y dos cambios simultáneos sobre el mismo caso.

## HU-04 · Asignarme un caso (#71)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-12 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `a386869` (incluye #69, #70 y #79) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos y 21 registros de historial al inicio). Para probar un agente inactivo se agregó el usuario de prueba **Agente Inactivo** (id 7, agente, `activo = 0`) solo en esta base. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/bandeja-soporte`, usuario de prueba **Diego Torres** (id 3, agente) |

En cada petición rechazada se revisaron el caso y su historial en MySQL antes y después, para comprobar que no cambió nada.

### CP-06 · Asignar agente (E1) ✅

**Pasos**
1. En **Bandeja**, con Diego Torres, pulsar **Asignarme** en la fila del caso `#1` (`Pendiente`, sin agente).
2. Consultar el caso y su historial en MySQL.

**Esperado:** se guardan el responsable y la fecha de asignación, el caso pasa a `En análisis` y el historial registra `asignacion`.

**Obtenido**
- La bandeja se recarga y la fila `#1` muestra **En análisis**, **Diego Torres** como agente y el botón **Pasar a En atención**. El botón **Asignarme** desaparece.
- En MySQL:

  ```text
  id  estado       agente_id  fecha_asignacion
  1   En análisis  3          2026-10-12 14:18:29
  ```

- El historial del caso 1 tiene una sola fila nueva:

  ```text
  id  evento      estado_anterior  estado_nuevo  usuario_id  fecha                detalle
  22  asignacion  Pendiente        En análisis   3           2026-10-12 14:18:29  El agente asume la atención del caso (HU-04).
  ```

**Evidencia:** [`hu04-e5-boton.jpg`](../evidencias/pruebas/hu04-e5-boton.jpg) (antes) · [`cp06-asignar.jpg`](../evidencias/pruebas/cp06-asignar.jpg) (después)

### E2 · El caso ya tiene agente ✅

**Pasos:** con el caso 1 ya asignado a Diego, `PATCH /api/casos/1/asignar` con `usuario_id` 4 (María) y luego con 3 (Diego).

**Esperado:** `409` y no cambia nada.

**Obtenido:** las dos peticiones responden `409` · "El caso ya tiene un agente asignado.". El caso 1 sigue con `agente_id = 3` y la misma `fecha_asignacion`, y no se agrega ninguna fila al historial.

### E3 · Caso En análisis sin agente ✅

**Pasos**
1. En **Bandeja**, con Diego, pulsar **Asignarme** en la fila del caso `#2` (`En análisis`, sin agente).
2. Abrir **Ver historial** del caso 2 y consultarlo en MySQL.

**Esperado:** Diego queda como responsable y el estado sigue `En análisis`.

**Obtenido**

```text
id  estado       agente_id  fecha_asignacion
2   En análisis  3          2026-10-12 14:18:48

id  evento         estado_anterior  estado_nuevo  usuario_id  fecha
2   creacion       NULL             Pendiente     2           2026-10-06 10:30:00
3   cambio_estado  Pendiente        En análisis   3           2026-10-06 11:00:00
23  asignacion     En análisis      En análisis   3           2026-10-12 14:18:48
```

La línea de tiempo muestra el evento **Agente asignado** con `En análisis → En análisis`.

**Evidencia:** [`hu04-e3-en-analisis.jpg`](../evidencias/pruebas/hu04-e3-en-analisis.jpg)

### E4 · No se pasa a En atención sin agente ✅

**Pasos:** antes de asignarlo, en **Bandeja**, pulsar **Pasar a En atención** en la fila del caso `#2` (`En análisis`, sin agente).

**Esperado:** el sistema lo impide (`409`).

**Obtenido:** la fila muestra "Para pasar a En atención, el caso debe tener un agente asignado.". En MySQL el caso 2 sigue `En análisis`, sin agente y con sus 2 filas de historial. Con agente, la regla deja pasar: `PATCH /api/casos/1/estado` a `En atención` con Diego responde `200`.

**Evidencia:** [`hu04-e4-sin-agente.jpg`](../evidencias/pruebas/hu04-e4-sin-agente.jpg)

### E5 · El botón solo aparece donde corresponde ✅

**Pasos:** abrir **Bandeja** con Diego antes de asignar nada.

**Esperado:** **Asignarme** solo en los casos sin agente que están `Pendiente` o `En análisis`.

**Obtenido**

| Caso | Estado | Agente | ¿Asignarme? |
|---|---|---|---|
| #1 | Pendiente | Sin asignar | Sí |
| #2 | En análisis | Sin asignar | Sí |
| #3 | En atención | Diego Torres | No |
| #4 | En validación | María Prieto | No |

Después de asignarse, el botón desaparece de la fila (CP-06 y E3).

**Evidencia:** [`hu04-e5-boton.jpg`](../evidencias/pruebas/hu04-e5-boton.jpg)

### Excepciones de HU-04

Todas se ejecutaron con `PATCH /api/casos/:id/asignar`, y en ninguna de las rechazadas cambió el caso ni el historial.

| Situación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| El caso no existe | `id = 999` | `404` | `404` · "Caso no encontrado" · "No existe un caso con id 999." | ✅ |
| `id` no es un entero positivo | `id = abc` y `id = 0` | `400` | `400` · "El id del caso debe ser un entero positivo." | ✅ |
| `usuario_id` inválido | Sin cuerpo y con `"usuario_id": "x"` | `400` | `400` · "usuario_id debe ser un entero positivo." | ✅ |
| El usuario no existe | `usuario_id = 99` | `400` | `400` · "El usuario indicado no existe." | ✅ |
| El usuario está inactivo | `usuario_id = 7` (Agente Inactivo) | `400` | `400` · "El usuario indicado está inactivo." | ✅ |
| El usuario no es agente | `usuario_id` 1 (solicitante), 5 (validador) y 6 (administradora) | `400` | `400` · "Solo un usuario con rol agente puede asignarse casos." | ✅ |
| El caso ya tiene agente | Casos 3 (`En atención`), 4 (`En validación`) y 5 (`Cerrada`) | `409` | `409` · "El caso ya tiene un agente asignado." | ✅ |
| Estado no asignable, sin agente | Se insertaron por SQL, solo en esta base, el caso 9 (`Cerrada`) y el 10 (`En validación`), los dos sin agente, para probar la regla de estado por separado | `409` | `409` · "Solo se asignan casos Pendiente o En análisis (está Cerrada)." y "(está En validación)." Siguen sin agente y sin historial. | ✅ |
| Dos agentes a la vez | Caso nuevo 7 (`POST /api/casos`, `Pendiente`). Dos `PATCH /api/casos/7/asignar` en paralelo, de Diego y de María | Uno `200` y otro `409`, con un solo evento | María recibe `200` y Diego `409` · "El caso ya tiene un agente asignado.". El caso queda `En análisis` con `agente_id = 4` y **una** sola fila `asignacion` (`Pendiente → En análisis`). | ✅ |
| Error de la base de datos | Caso nuevo 8 (`Pendiente`). Se creó un *trigger* temporal que hace fallar el `INSERT` en `historial` y se pidió la asignación con Diego | `500` y *rollback* | `500` · "No se pudo asignar el caso". El caso 8 sigue `Pendiente`, sin agente ni `fecha_asignacion`, y solo con su fila `creacion`. Después se borró el *trigger*. | ✅ |

### Prueba de reinicio

Con la base recargada desde los seeds, Diego se asignó el caso 1 (`200`, `fecha_asignacion = 2026-10-12 14:20:33`). Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo (`/api/health` → `db: up`). En MySQL, el caso 1 sigue `En análisis`, con `agente_id = 3`, la misma fecha y su fila `asignacion`, y el historial conserva 22 filas. `GET /api/casos?bandeja=1` muestra el caso 1 con **Diego Torres**. ✅

> El primer intento de esta prueba se descartó: un script del entorno de prueba, que había quedado en segundo plano, volvió a cargar `schema.sql` y `seeds.sql` al reiniciar MySQL. No es un fallo de la aplicación.

### Observaciones

- **"Pasar a En atención" aparece en casos sin agente:** la bandeja ofrece ese botón en los casos `En análisis` sin agente, aunque el backend siempre lo rechaza con `409` (E4). La regla se cumple y el mensaje es claro, así que no se registra como defecto. Se sugirió ocultar el botón en la revisión del PR #87.
- **Orden de las validaciones del 409:** si el caso tiene agente, el backend responde "El caso ya tiene un agente asignado." aunque además esté `En atención`, `En validación` o `Cerrada`. Las dos causas dan `409`, así que cumple la tabla de excepciones.
- **Resuelto lo pendiente de HU-05:** ahora se exige un agente para pasar a `En atención` (E4), y los seeds ya registran las asignaciones como `Pendiente → En análisis` o `En análisis → En análisis` (D-14).
- En la consola del navegador solo aparece el `409` esperado de E4.

### Conclusión

HU-04 cumple CP-06, E2 a E5 y todas sus excepciones, incluidas la concurrencia y el *rollback*, y no se registraron defectos. Candidatos a casos propios en la #38: asignación simultánea del mismo caso y asignación de un caso `En análisis` sin agente.

## HU-06 · Registrar diagnóstico y solución (#74)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-12 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `fdd94cb` (incluye #72 y #73) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos, 4 atenciones y 21 registros de historial al inicio). Para probar un agente inactivo se agregó el usuario de prueba **Agente Inactivo** (id 7, agente, `activo = 0`) solo en esta base. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/bandeja-soporte`, usuarios de prueba **Diego Torres** (id 3) y **María Prieto** (id 4), los dos agentes |

En cada petición rechazada se revisaron el caso, sus atenciones y su historial en MySQL, para comprobar que no cambió nada.

### E4 · No se pasa a En validación sin una atención con solución ✅

Se ejecutó primero porque el caso `#3` de los seeds (`En atención`, asignado a Diego) solo tiene una atención con diagnóstico y sin solución.

**Pasos:** en **Bandeja**, con Diego, pulsar **Pasar a En validación** en la fila del caso `#3`.

**Esperado:** el sistema lo impide (`409`).

**Obtenido:** la fila muestra "Para pasar a En validación, el caso debe tener una atención con solución.". En MySQL el caso 3 sigue `En atención`, con 1 atención y 4 filas de historial. Por API, con un caso nuevo cuya única atención no tiene solución, `PATCH /api/casos/7/estado` a `En validación` también responde `409` con el mismo mensaje.

**Evidencia:** [`hu06-e4-sin-solucion.jpg`](../evidencias/pruebas/hu06-e4-sin-solucion.jpg)

### E3 · Diagnóstico corto ✅

**Pasos:** con Diego, pulsar **Registrar atención** en el caso `#3` y escribir "Falla" (5 caracteres) en el diagnóstico.

**Esperado:** el sistema no deja guardar y el backend responde `400` sin guardar nada.

**Obtenido:**
- En la interfaz, el contador muestra **5 / mínimo 10** en rojo y **Guardar atención** queda desactivado.
- Por API, `POST /api/casos/7/atenciones` responde `400` · "Datos inválidos" · "Diagnóstico mínimo de 10 caracteres." si el diagnóstico falta, si tiene 5 caracteres ("corto") o si son espacios con una sola letra. Con una solución de 3 caracteres responde "Solución mínimo de 10 caracteres.", y si fallan los dos campos, `detalles` trae un elemento por cada fallo.
- No se agregó ninguna fila a `atencion` ni a `historial`.

**Evidencia:** [`hu06-e3-diagnostico-corto.jpg`](../evidencias/pruebas/hu06-e3-diagnostico-corto.jpg)

### CP-07 · Registrar diagnóstico y solución (E1) ✅

**Pasos**
1. En el mismo formulario del caso `#3`, con Diego, escribir:
   - **Diagnóstico:** "La fuente de poder está quemada; el equipo no recibe energía."
   - **Solución:** "Se reemplazó la fuente de poder y el equipo enciende normalmente."
2. Pulsar **Guardar atención**.
3. Consultar la atención y el historial en MySQL, y abrir de nuevo el formulario.

**Esperado:** la atención queda guardada con su fecha y su agente, el historial registra `atencion` y el caso no cambia de estado.

**Obtenido**
- El modal se cierra y la bandeja se recarga. El caso `#3` sigue `En atención`.
- En MySQL:

  ```text
  id  caso_id  diagnostico                                                  solucion                                                           fecha                agente_id
  5   3        La fuente de poder está quemada; el equipo no recibe energía.  Se reemplazó la fuente de poder y el equipo enciende normalmente.  2026-10-12 17:00:47  3

  id  evento    estado_anterior  estado_nuevo  usuario_id  fecha                detalle
  22  atencion  En atención      En atención   3           2026-10-12 17:00:47  El agente registra diagnóstico y solución (HU-06).
  ```

- Al abrir de nuevo el formulario aparecen **Atenciones previas (2)**: la de los seeds y la nueva, con diagnóstico, solución, agente y fecha.
- Por API, una atención **solo con diagnóstico** en el caso 7 responde `201` con `solucion = null` y también registra `atencion` en el historial.

**Evidencia:** [`cp07-formulario.jpg`](../evidencias/pruebas/cp07-formulario.jpg) (antes) · [`cp07-atencion-guardada.jpg`](../evidencias/pruebas/cp07-atencion-guardada.jpg) (después)

### E5 · Pasar a En validación con una atención con solución ✅

**Pasos:** después de CP-07, con Diego, pulsar **Pasar a En validación** en el caso `#3` y abrir **Ver historial**.

**Esperado:** el cambio se guarda y el historial registra `envio_validacion`.

**Obtenido:** la fila muestra **En validación** y **Sin acciones**. En MySQL:

```text
id  estado         agente_id  fecha_cierre
3   En validación  3          NULL

id  evento            estado_anterior  estado_nuevo   usuario_id  fecha
23  envio_validacion  En atención      En validación  3           2026-10-12 17:01:01
```

La línea de tiempo del caso muestra, en orden, **Atención registrada** y **Enviado a validación**.

**Evidencia:** [`hu06-e5-en-validacion.jpg`](../evidencias/pruebas/hu06-e5-en-validacion.jpg) · [`hu06-historial.jpg`](../evidencias/pruebas/hu06-historial.jpg)

### E2 · Agente no asignado ✅

**Pasos**
1. Abrir **Bandeja** con María Prieto.
2. Por API, `POST /api/casos/7/atenciones` con `usuario_id` 4 (María) en el caso 7, asignado a Diego y `En atención`.

**Esperado:** el sistema lo impide (`409`).

**Obtenido:** María no ve **Registrar atención** en el caso `#3` de Diego. La petición responde `409` · "Solo el agente asignado registra la atención." y no se guarda nada.

**Evidencia:** [`hu06-e2-otro-agente.jpg`](../evidencias/pruebas/hu06-e2-otro-agente.jpg)

### Excepciones de HU-06

Se ejecutaron con `POST /api/casos/:id/atenciones`, sobre el caso 7 (creado con `POST /api/casos`, asignado a Diego y pasado a `En atención`) salvo que se indique otro. En ninguna de las rechazadas cambió el caso, las atenciones ni el historial.

| Situación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| El caso no existe | `id = 999` | `404` | `404` · "Caso no encontrado" · "No existe un caso con id 999." | ✅ |
| `id` no es un entero positivo | `id = abc` y `id = 0` | `400` | `400` · "El id del caso debe ser un entero positivo." | ✅ |
| `usuario_id` inválido | `"usuario_id": "x"` | `400` | `400` · "usuario_id debe ser un entero positivo." | ✅ |
| El usuario no existe, está inactivo o no es agente | `usuario_id` 99, 7 (Agente Inactivo), 1 (solicitante) y 5 (validador) | `400` | `400` · "El usuario debe existir, estar activo y tener rol agente." | ✅ |
| El usuario no es el agente asignado | María en el caso 7 (E2) · Diego en el caso 2 (`En análisis`, sin agente) | `409` | `409` · "Solo el agente asignado registra la atención." | ✅ |
| El caso no está `En atención` | Diego en el caso 3 (`En validación`) y en el 5 (`Cerrada`) | `409` | `409` · "Solo se registra atención en un caso En atención." | ✅ |
| Diagnóstico o solución inválidos | Ver E3 | `400` con un elemento en `detalles` por fallo | `400` con uno o dos elementos | ✅ |
| `En atención → En validación` sin atención con solución | Ver E4 | `409` | `409` | ✅ |
| Error de la base de datos | Se creó un *trigger* temporal que hace fallar todo `INSERT` en `historial` y se registró una atención con Diego en el caso 7 | `500` y *rollback* | `500` · "No se pudo registrar la atención". El caso 7 sigue con 2 atenciones y 5 filas de historial. Después se borró el *trigger*. | ✅ |

> En el primer intento de la prueba de *rollback*, el *trigger* no se creó por un error de sintaxis del script de prueba, así que la petición se guardó normalmente (`201`, atención 7 y evento `atencion` 28 del caso 7). Se repitió con un *trigger* válido; la atención 7 queda como un registro válido más del caso 7.

**Consulta de atenciones (`GET /api/casos/:id/atenciones`)**

| Situación | Obtenido | Estado |
|---|---|---|
| Agente, caso 7 | `200` con la atención del caso | ✅ |
| Validador (5) y solicitante dueño (Laura, 1), caso 3 | `200` con las 2 atenciones en orden de fecha y el nombre del agente | ✅ |
| Solicitante ajeno (Carlos, 2), caso 3 | `404` · "Caso no encontrado" (no revela que existe) | ✅ |
| Caso 999 | `404` | ✅ |
| Sin `usuario_id` | `400` · "El id del caso y usuario_id deben ser enteros positivos." | ✅ |

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo (`/api/health` → `db: up`). En MySQL, el caso 3 sigue `En validación`, las atenciones 5, 6 y 7 conservan su fecha (la 5 y la 7, también su solución), y el historial conserva 28 filas. `GET /api/casos/3/atenciones?usuario_id=5` devuelve las 2 atenciones del caso. ✅

### Observaciones

- **El mensaje de E4 se queda en la fila:** después de guardar la atención con solución, la fila del caso `#3` sigue mostrando "Para pasar a En validación, el caso debe tener una atención con solución." hasta que se pulsa otra vez **Pasar a En validación**. No impide el flujo, así que no se registra como defecto; se puede limpiar el mensaje al recargar la bandeja.
- **Texto del historial:** el evento `atencion` siempre dice "El agente registra diagnóstico y solución (HU-06).", también cuando la atención no trae solución (ya se sugirió en la revisión de la #72).
- **Orden de las validaciones del 409:** en un caso sin agente, el backend responde "Solo el agente asignado registra la atención." antes de revisar el estado. Las dos causas dan `409`, así que cumple la tabla de excepciones.
- En la consola del navegador solo aparece el `409` esperado de E4, y el log de la API no tiene errores.

### Conclusión

HU-06 cumple CP-07, E2 a E5, todas sus excepciones y el *rollback*, y no se registraron defectos. Candidatos a casos propios en la #38: atención solo con diagnóstico (solución opcional) y consulta de atenciones de un caso ajeno por un solicitante.

## HU-07 · Aprobar o devolver una solución (#77)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-12 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `0c1d67b` (incluye #75 y #76) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos, 4 atenciones y 21 registros de historial al inicio). Para probar un validador inactivo se agregó el usuario de prueba **Validador Inactivo** (id 7, validador, `activo = 0`) solo en esta base. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/por-validar`, usuario de prueba **Pedro Validador** (id 5). Para reenviar el caso a validación se usó **María Prieto** (id 4, agente) en `/bandeja-soporte` |

En cada petición rechazada se revisaron el caso y su historial en MySQL, para comprobar que no cambió nada.

### E5 · La pantalla Por validar muestra solo los casos En validación ✅

**Pasos:** abrir `/por-validar` con Pedro Validador.

**Esperado:** solo aparecen los casos `En validación`, con la solución registrada por el agente.

**Obtenido:** aparece solo el caso `#4`, el único `En validación` de los seeds, con su categoría, el agente **María Prieto**, la prioridad y la solución "Se liberó cuota y se corrigió la regla; el correo ya recibe mensajes.". Los casos `Pendiente`, `En análisis`, `En atención` y `Cerrada` no aparecen. La solución también carga al abrir la URL directamente o al recargar con F5.

**Evidencia:** [`hu07-e5-por-validar.jpg`](../evidencias/pruebas/hu07-e5-por-validar.jpg)

### E3 · Motivo vacío o corto ✅

**Pasos:** con Pedro, pulsar **Devolver** en el caso `#4`, escribir "Falla" (5 caracteres) y pulsar **Confirmar devolución**.

**Esperado:** el sistema lo rechaza (`400`) y el caso no cambia.

**Obtenido**
- En la interfaz aparece "El motivo mínimo es de 10 caracteres." y no se envía ninguna petición.
- Por API, `POST /api/casos/4/validacion` con `accion: "devolver"` responde `400` · "Datos inválidos" · "El motivo de devolución mínimo es de 10 caracteres." en tres casos: sin motivo, con "Falla" y con una sola letra rodeada de espacios.
- En MySQL el caso 4 sigue `En validación` y con sus 4 filas de historial.

**Evidencia:** [`hu07-e3-motivo-corto.jpg`](../evidencias/pruebas/hu07-e3-motivo-corto.jpg)

### CP-08 · Devolver desde validación (E2) ✅

**Pasos**
1. Con Pedro, pulsar **Devolver** en el caso `#4` y escribir el motivo "El buzón sigue sin recibir correos externos; revisar la regla de reenvío.".
2. Pulsar **Confirmar devolución**.
3. Consultar el caso y su historial en MySQL, y abrir la **Bandeja** con María Prieto.

**Esperado:** el caso vuelve a `En atención` con el mismo agente y el historial registra `devolucion` con el motivo.

**Obtenido**
- La lista se recarga y queda vacía.
- En MySQL:

  ```text
  id  estado       agente_id  fecha_asignacion     fecha_cierre
  4   En atención  4          2026-10-05 14:00:00  NULL

  id  evento      estado_anterior  estado_nuevo  usuario_id  fecha                detalle
  22  devolucion  En validación    En atención   5           2026-10-12 20:03:44  El buzón sigue sin recibir correos externos; revisar la regla de reenvío.
  ```

- El caso conserva el agente y la fecha de asignación. En la bandeja de María, el `#4` aparece `En atención` con **Registrar atención** y **Pasar a En validación**, y la línea de tiempo muestra "Devuelto" con el motivo.
- El endpoint genérico no permite devolver: `PATCH /api/casos/3/estado` de `En validación` a `En atención`, hecho por el agente, responde `409` · "La devolución se hace por validación (HU-07)." (regla 5).

**Evidencia:** [`cp08-motivo.jpg`](../evidencias/pruebas/cp08-motivo.jpg) (antes) · [`cp08-historial.jpg`](../evidencias/pruebas/cp08-historial.jpg) (después)

### CP-09 · Cerrar caso aprobado (E1) ✅

**Pasos**
1. Con María, pulsar **Pasar a En validación** en el caso `#4` de la bandeja. La atención con solución de los seeds sigue vigente.
2. Con Pedro, pulsar **Aprobar** en el caso `#4` de `/por-validar`.
3. Consultar el caso y su historial en MySQL.

**Esperado:** el caso queda `Cerrada` con `fecha_cierre` y el historial registra `cierre`.

**Obtenido**
- La lista muestra "No hay casos pendientes de validación".
- En MySQL:

  ```text
  id  estado   agente_id  fecha_cierre
  4   Cerrada  4          2026-10-12 20:04:31

  id  evento            estado_anterior  estado_nuevo   usuario_id  fecha                detalle
  23  envio_validacion  En atención      En validación  4           2026-10-12 20:04:07  NULL
  24  cierre            En validación    Cerrada        5           2026-10-12 20:04:31  Validación aprobada; se cierra el caso.
  ```

- **Aprobar con motivo:** al aprobar el caso 3 por API con el motivo "Verificado en sitio con el docente del laboratorio.", el caso queda `Cerrada` y ese texto se guarda en el `detalle` del evento `cierre` (fila 31).
- El endpoint genérico no permite llegar a `Cerrada`: `PATCH /api/casos/3/estado` a `Cerrada`, hecho por el agente, responde `409` · "Solo se llega a Cerrada por validación (HU-07)." (regla 5).

**Evidencia:** [`cp09-lista-vacia.jpg`](../evidencias/pruebas/cp09-lista-vacia.jpg)

### E4 · Caso que no está En validación ✅

**Pasos:** con Pedro, `POST /api/casos/:id/validacion` sobre un caso en cada uno de los demás estados.

**Esperado:** `409` y no cambia nada.

**Obtenido**

| Caso | Estado | Acción | Respuesta |
|---|---|---|---|
| 4 | Cerrada | aprobar y devolver | `409` · "Solo se validan casos En validación (está Cerrada)." |
| 1 | Pendiente | aprobar | `409` · "… (está Pendiente)." |
| 2 | En análisis | aprobar | `409` · "… (está En análisis)." |
| 3 | En atención | aprobar | `409` · "… (está En atención)." |

Después de estas peticiones y de las excepciones siguientes, el historial sigue con 24 filas.

### Excepciones de HU-07

Se ejecutaron con `POST /api/casos/:id/validacion`, salvo que se indique otro endpoint. En ninguna de las peticiones rechazadas cambió el caso ni el historial.

| Situación | Pasos | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| El caso no existe | `id = 999` | `404` | `404` · "Caso no encontrado" · "No existe un caso con id 999." | ✅ |
| `id` no es un entero positivo | `id = abc` y `id = 0` | `400` | `400` · "El id del caso debe ser un entero positivo." | ✅ |
| `usuario_id` inválido | Sin `usuario_id` y con `"usuario_id": "x"` | `400` | `400` · "usuario_id debe ser un entero positivo." | ✅ |
| El usuario no existe o está inactivo | `usuario_id` 99 y 7 (Validador Inactivo) | `400` | `400` · "El usuario indicado no existe o está inactivo." | ✅ |
| El usuario no es validador | `usuario_id` 1 (solicitante), 3 (agente) y 6 (administradora) | `400` | `400` · "Solo un usuario con rol validador puede validar casos." | ✅ |
| `accion` inválida | `"accion": "borrar"` y sin `accion` | `400` | `400` · "Acción inválida. Valores permitidos: aprobar, devolver." | ✅ |
| Devolver sin motivo o con un motivo corto | Ver E3 | `400` | `400` | ✅ |
| El caso no está `En validación` | Ver E4 | `409` | `409` | ✅ |
| `estado=` inválido | `GET /api/casos?estado=Inventado` | `400` | `400` · "estado inválido. Valores permitidos: Pendiente, En análisis, En atención, En validación, Cerrada." Con `estado=Cerrada` y con `estado=En atención&prioridad=P1` responde `200` solo con las coincidencias. | ✅ |
| Dos validaciones a la vez | Con el caso 1 `En validación`, dos peticiones en paralelo: una para aprobar y otra para devolver con motivo | Una `200` y otra `409`, con un solo evento | La devolución recibe `200` y la aprobación `409` · "… (está En atención)." El caso 1 queda `En atención`, sin `fecha_cierre` y con **una** sola fila `devolucion`. | ✅ |
| Error de la base de datos | Con el caso 3 `En validación`, se creó un *trigger* temporal que hace fallar todo `INSERT` en `historial` y se pidió aprobar y devolver | `500` y *rollback* | `500` · "No se pudo validar el caso" en las dos. El caso 3 sigue `En validación`, sin `fecha_cierre`, y el historial sigue con 30 filas. Después se borró el *trigger*. | ✅ |

### Usuario que no es validador en la pantalla ✅

**Pasos:** abrir `/por-validar` con Diego Torres (agente) mientras el caso `#1` está `En validación`.

**Obtenido:** aparece el aviso "Solo un usuario con rol validador puede aprobar o devolver (el backend lo exige).", y **Aprobar** y **Devolver** están desactivados. **Ver historial** sigue disponible.

**Evidencia:** [`hu07-no-validador.jpg`](../evidencias/pruebas/hu07-no-validador.jpg)

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo (`/api/health` → `db: up`). En MySQL:
- los casos 3 y 4 siguen `Cerrada`, con su `fecha_cierre` (2026-10-12 20:06:29 y 20:04:31);
- el caso 1 sigue `En validación`;
- el historial conserva 31 filas, con los eventos `devolucion` y `cierre` y su `detalle`.

`GET /api/casos?estado=En validación` devuelve solo el caso 1. ✅

### Defecto encontrado

**DEF-02 (#93) · La lista de Por validar desaparece después de un error de validación** (P3)

| Campo | Valor |
|---|---|
| Pasos | 1. Con Pedro, abrir `/por-validar` con los casos `#1` y `#3` `En validación`. 2. Cerrar el `#3` desde otra pestaña o por API. 3. Pulsar **Aprobar** en el `#3`. |
| Esperado | Se muestra el `409` y el caso `#1` sigue en la lista. |
| Obtenido | La pantalla solo muestra "Solo se validan casos En validación (está Cerrada).". El `#1` deja de verse hasta recargar con F5, aunque sigue `En validación`. |
| Causa | `frontend/src/pages/PorValidar.tsx:121` guarda el error de la acción en `error`. El render (`:148-152`) usa ese mismo estado para reemplazar la lista cuando falla la carga. |
| Impacto | Bajo: el backend rechaza la operación y no se pierde ni se corrompe ningún dato. Se reportó en la segunda revisión del PR #92, que se fusionó sin corregirlo. |
| Estado | Abierto |

**Evidencia:** [`hu07-def02-lista-oculta.jpg`](../evidencias/pruebas/hu07-def02-lista-oculta.jpg)

### Observaciones

- **El aviso del motivo corto se queda visible:** después de E3, "El motivo mínimo es de 10 caracteres." sigue en pantalla mientras se escribe un motivo válido, hasta pulsar **Confirmar devolución**. No impide el flujo.
- **Aprobar no pide confirmación:** un clic cierra el caso, y un caso `Cerrada` ya no puede cambiar. Se sugiere pedir confirmación antes de aprobar.
- **Por validar no aparece en el menú de los agentes:** Diego llega a la pantalla solo escribiendo la URL. Es correcto, porque la pantalla es del validador.
- En la consola del navegador solo aparece el `409` esperado de DEF-02, y el log de la API no tiene errores.

### Conclusión

HU-07 cumple CP-08, CP-09, E3 a E5, la regla 5 y todas sus excepciones, incluidos la concurrencia y el *rollback*. Se registró un defecto de la interfaz que no es crítico (DEF-02, #93). Candidatos a casos propios en la #38: aprobar con motivo y dos validaciones simultáneas del mismo caso.

---

## HU-08 · Historial y flujo completo del MVP (#80)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-12 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `0c1d67b` (incluye HU-01 a HU-08) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos, 4 atenciones y 21 registros de historial al inicio). Para probar un usuario inactivo se agregó el usuario de prueba **Usuario Inactivo** (id 7, solicitante, `activo = 0`) solo en esta base y se borró al terminar. |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite. Usuarios de prueba: **Laura Gómez** (id 1, solicitante), **Diego Torres** (id 3, agente), **Pedro Validador** (id 5, validador) y **Ana Admin** (id 6). **Carlos Ruiz** (id 2, solicitante) se usó como solicitante ajeno. |

### Flujo completo del MVP desde la interfaz ✅

Se recorrió **Registrar → Clasificar → Priorizar → Asignar → Atender → Validar → Cerrar**, con una devolución, usando solo la interfaz:

| # | Usuario | Pantalla | Acción | Resultado |
|---|---|---|---|---|
| 1 | Laura | `/crear-caso` | Registrar un Incidente de **Hardware / Proyector**, **P1**, "Proyector del aula 201 no muestra imagen", con la descripción "El proyector del aula 201 enciende pero no muestra la imagen del computador." | "¡Caso #7 registrado con éxito!" · `Pendiente` |
| 2 | Diego | `/bandeja-soporte` | **Asignarme** en el `#7` | `En análisis`, agente Diego Torres |
| 3 | Diego | `/bandeja-soporte` | **Pasar a En atención** | `En atención` |
| 4 | Diego | `/bandeja-soporte` | **Registrar atención**: "El cable HDMI del aula 201 está dañado y no transmite señal." / "Se reemplazó el cable HDMI y el proyector muestra la imagen." | Atención guardada |
| 5 | Diego | `/bandeja-soporte` | **Pasar a En validación** | `En validación` · "Sin acciones" |
| 6 | Pedro | `/por-validar` | **Devolver** con el motivo "La imagen se ve con parpadeo; revisar también el puerto HDMI del proyector." | El `#7` sale de la lista y vuelve a `En atención` con Diego |
| 7 | Diego | `/bandeja-soporte` | **Registrar atención**: "El puerto HDMI del proyector tiene un pin doblado que causa el parpadeo." / "Se reemplazó el módulo HDMI del proyector y la imagen se ve estable." | Atención guardada |
| 8 | Diego | `/bandeja-soporte` | **Pasar a En validación** | `En validación` |
| 9 | Pedro | `/por-validar` | **Aprobar** el `#7`, que muestra la segunda solución | El `#7` sale de la lista |
| 10 | Laura | `/mis-solicitudes` | Consultar | El `#7` aparece primero y `Cerrada` |

**En MySQL**

```text
id  estado   agente_id  fecha_creacion       fecha_asignacion     fecha_cierre
7   Cerrada  3          2026-10-12 20:21:31  2026-10-12 20:22:05  2026-10-12 20:24:35

id  diagnostico                                                              agente_id  fecha
5   El cable HDMI del aula 201 está dañado y no transmite señal.             3          2026-10-12 20:22:33
6   El puerto HDMI del proyector tiene un pin doblado que causa el parpadeo. 3          2026-10-12 20:24:14
```

**Evidencia:** [`hu08-flujo-registro.jpg`](../evidencias/pruebas/hu08-flujo-registro.jpg), [`hu08-flujo-atencion.jpg`](../evidencias/pruebas/hu08-flujo-atencion.jpg)

### E1 · Historial del flujo completo, en orden, con usuario y fecha ✅

**Pasos:** con Laura, pulsar **Ver historial** en el `#7` desde `/mis-solicitudes`. Después, `GET /api/casos/7/historial` con `usuario_id` 1, 3, 5 y 6.

**Esperado:** aparecen en orden la creación, la asignación, los cambios de estado, la atención, el envío a validación y el cierre, cada uno con usuario y fecha.

**Obtenido**
- La línea de tiempo muestra 9 eventos en orden: Caso registrado (Laura) → Agente asignado (Diego) → Cambio de estado → Atención registrada → Enviado a validación → Devuelto → Atención registrada → Enviado a validación → Caso cerrado (Pedro). Cada uno tiene los badges de estado, el usuario y la fecha.
- La API responde `200` con los mismos 9 eventos, en el mismo orden, para Laura (dueña), Diego (agente), Pedro (validador) y Ana (administradora).
- En MySQL:

```text
id  evento            estado_anterior  estado_nuevo   usuario_id  fecha                detalle
22  creacion          NULL             Pendiente      1           2026-10-12 20:21:31  Caso registrado desde POST /api/casos (HU-01).
23  asignacion        Pendiente        En análisis    3           2026-10-12 20:22:05  El agente asume la atención del caso (HU-04).
24  cambio_estado     En análisis      En atención    3           2026-10-12 20:22:15  NULL
25  atencion          En atención      En atención    3           2026-10-12 20:22:33  El agente registra diagnóstico y solución (HU-06).
26  envio_validacion  En atención      En validación  3           2026-10-12 20:22:38  NULL
27  devolucion        En validación    En atención    5           2026-10-12 20:23:41  La imagen se ve con parpadeo; revisar también el puerto HDMI del proyector.
28  atencion          En atención      En atención    3           2026-10-12 20:24:14  El agente registra diagnóstico y solución (HU-06).
29  envio_validacion  En atención      En validación  3           2026-10-12 20:24:19  NULL
30  cierre            En validación    Cerrada        5           2026-10-12 20:24:35  Validación aprobada; se cierra el caso.
```

Cada acción del flujo dejó exactamente un registro, y las fechas de `fecha_asignacion` y `fecha_cierre` del caso coinciden con las de los eventos `asignacion` y `cierre`.

**Evidencia:** [`hu08-e1-historial-inicio.jpg`](../evidencias/pruebas/hu08-e1-historial-inicio.jpg), [`hu08-e1-historial-cierre.jpg`](../evidencias/pruebas/hu08-e1-historial-cierre.jpg)

### E2 · La devolución aparece con su motivo ✅

**Pasos:** devolver el `#7` desde `/por-validar` con un motivo y consultar el historial.

**Esperado:** aparece la devolución con su motivo.

**Obtenido:** la línea de tiempo muestra "Devuelto: La imagen se ve con parpadeo; revisar también el puerto HDMI del proyector.", con `En validación → En atención`, Pedro Validador y la fecha. En la API y en MySQL es el evento `devolucion` (id 27), con el motivo en `detalle`.

**Evidencia:** [`hu08-e2-devolucion.jpg`](../evidencias/pruebas/hu08-e2-devolucion.jpg) y [`hu08-e1-historial-cierre.jpg`](../evidencias/pruebas/hu08-e1-historial-cierre.jpg)

### E3 · Un solicitante ajeno recibe 404 ✅

**Pasos:** `GET /api/casos/7/historial?usuario_id=2` (Carlos Ruiz, que no registró el `#7`).

**Esperado:** `404` sin datos.

**Obtenido:** `404` · "Caso no encontrado" · "No existe un caso con id 7.". Es la misma respuesta que para un caso inexistente, así que no revela que el caso existe. En la interfaz, el `#7` no aparece en Mis Solicitudes de Carlos.

### E4 · "Ver historial" funciona en las tres pantallas ✅

| Pantalla | Usuario | Resultado |
|---|---|---|
| `/mis-solicitudes` | Laura | Abre la línea de tiempo del `#7` con los 9 eventos (ver E1) |
| `/bandeja-soporte` | Diego | Con el `#7` recién devuelto, abre la línea de tiempo con 6 eventos, el último "Devuelto: …" |
| `/por-validar` | Pedro | Con el `#7` reenviado, abre la línea de tiempo con 8 eventos, el último "Enviado a validación" |

En las tres el modal se cierra con **Cerrar** y la lista sigue igual.

**Evidencia:** [`hu08-e4-bandeja.jpg`](../evidencias/pruebas/hu08-e4-bandeja.jpg)

### Excepciones de HU-08

| Situación | Petición | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| El caso no existe | `GET /api/casos/999/historial?usuario_id=1` | `404` | `404` · "Caso no encontrado" · "No existe un caso con id 999." | ✅ |
| El solicitante pide un caso que no es suyo | Ver E3 | `404` | `404` | ✅ |
| `id` no es entero positivo | `id` = `abc` y `0` | `400` | `400` · "Datos inválidos" · "El id del caso debe ser un entero positivo." | ✅ |
| `usuario_id` no es entero positivo | `usuario_id=x` y sin `usuario_id` | `400` | `400` · "usuario_id debe ser un entero positivo." | ✅ |
| El usuario no existe | `usuario_id=99` | `400` | `400` · "El usuario indicado no existe o está inactivo." | ✅ |
| El usuario está inactivo | `usuario_id=7` (Usuario Inactivo) | `400` | `400` · "El usuario indicado no existe o está inactivo." | ✅ |
| Error de la base de datos | Se renombró la tabla temporalmente (`RENAME TABLE historial TO historial_x`) y se pidió el historial del `#7` | `500` | `500` · "Table 'campushelp.historial' doesn't exist". Después se restauró la tabla y la petición volvió a responder `200`. | ✅ (ver observaciones) |

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo. `GET /api/casos/7/historial?usuario_id=1` responde `200` con los mismos 9 eventos en el mismo orden y el motivo de la devolución. Con `usuario_id=2` sigue respondiendo `404`. ✅

### Observaciones

- **El `500` expone el mensaje interno de MySQL:** `middlewares/errorHandler.js` devuelve `err.message` tal cual, así que el usuario ve "Table 'campushelp.historial' doesn't exist". Cumple el código y el formato `{ error, detalles }`, pero se sugiere un mensaje genérico (por ejemplo, "No se pudo consultar el historial"), como ya hace HU-07 con "No se pudo validar el caso". No bloquea.
- **La atención se muestra como `En atención → En atención`:** el evento `atencion` no cambia el estado y la línea de tiempo pinta los dos badges iguales. Es correcto, pero podría mostrarse un solo badge.
- **`cambio_estado` y `envio_validacion` no tienen `detalle`:** la línea de tiempo los muestra sin texto adicional. No afecta los criterios.
- Durante esta ejecución no aparecieron errores nuevos en la consola del navegador, y el log de la API no registró errores.

### Conclusión

El flujo principal del MVP funciona de punta a punta desde la interfaz, con persistencia en MySQL y una devolución intermedia. HU-08 cumple E1 a E4 y todas sus excepciones, y el historial sobrevive al reinicio. No se encontraron defectos nuevos. Candidato a caso propio en la #38: flujo completo con devolución y verificación del historial.

---

## HU-09 · Filtrar casos (#99)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-13 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `9f992fa` (incluye #97 y #98) |
| Base de datos | MySQL 8.0.39 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos y 21 registros de historial al inicio). Para tener coincidencias y descartes en cada filtro se registraron por la API dos casos de prueba: **#7** (Incidente, Red y conectividad / Internet, P1, Carlos Ruiz) y **#8** (Solicitud, Red y conectividad / Wi-Fi, P1, Laura Gómez). |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/casos`, usuario de prueba **Ana Admin** (id 6, administradora) |

Casos de la base durante la prueba:

| Caso | Tipo | Área / categoría | Prioridad | Estado |
|---|---|---|---|---|
| #1 | Incidente | Red y conectividad / Wi-Fi | P1 | Pendiente |
| #2 | Solicitud | Software / Instalación | P2 | En análisis |
| #3 | Incidente | Hardware / Computador | P1 | En atención |
| #4 | Incidente | Cuentas y acceso / Correo | P2 | En validación |
| #5 | Solicitud | Plataformas académicas / Campus virtual | P3 | Cerrada |
| #6 | Incidente | Red y conectividad / Internet | P2 | Cerrada |
| #7 | Incidente | Red y conectividad / Internet | P1 | Pendiente |
| #8 | Solicitud | Red y conectividad / Wi-Fi | P1 | Pendiente |

### CP-10 · Filtrar por tipo, área y prioridad (E1) ✅

**Pasos:** con Ana, abrir `/casos` y elegir, en este orden, Tipo **Incidente**, Prioridad **P1** y Área **Red y conectividad**.

**Esperado:** solo aparecen los casos que cumplen los tres filtros.

**Obtenido**

| Filtros aplicados | Casos en la tabla |
|---|---|
| Ninguno | #8, #7, #2, #1, #3, #6, #4, #5 (los 8, del más reciente al más antiguo) |
| Incidente | #7, #1, #3, #6, #4 |
| Incidente + P1 | #7, #1, #3 |
| Incidente + P1 + Red y conectividad | **#7, #1** |

- Se descartan el #8 por el tipo, el #6 por la prioridad y el #3 por el área.
- Cada cambio de selector hace una petición nueva al backend: `GET /api/casos?tipo=Incidente`, luego `?tipo=Incidente&prioridad=P1` y luego `?tipo=Incidente&area_id=3&prioridad=P1`. Al elegir el área se piden sus categorías con `GET /api/categorias?area_id=3` (Internet, Red cableada y Wi-Fi). La pantalla no filtra en memoria (regla 2).
- Por API, `GET /api/casos?tipo=Incidente&area_id=3&prioridad=P1` responde `200` con los casos 7 y 1.

**Evidencia:** [`cp10-filtros.jpg`](../evidencias/pruebas/cp10-filtros.jpg)

### E2 · Filtros sin coincidencias ✅

**Pasos:** con los filtros de CP-10, elegir la categoría **Red cableada**.

**Esperado:** la pantalla muestra "Sin resultados".

**Obtenido:** la tabla se reemplaza por "Sin resultados". Por API, `?tipo=Incidente&area_id=3&prioridad=P1&categoria_id=10` responde `200` con `[]`, y con `categoria_id=9` (Internet) solo devuelve el #7.

**Evidencia:** [`hu09-e2-sin-resultados.jpg`](../evidencias/pruebas/hu09-e2-sin-resultados.jpg)

### E3 · Limpiar los filtros ✅

**Pasos:** con los filtros de E2 aplicados, pulsar **Limpiar**.

**Esperado:** vuelven a aparecer todos los casos.

**Obtenido:** los cinco selectores vuelven a "Todos" o "Todas", la categoría vuelve a "Elige primero un área" y queda deshabilitada, y la tabla muestra de nuevo los 8 casos.

**Evidencia:** [`hu09-e3-limpiar.jpg`](../evidencias/pruebas/hu09-e3-limpiar.jpg)

### E4 · Valor inválido en la API ✅

**Pasos:** `GET /api/casos?prioridad=P9`.

**Esperado:** `400` con `{ error, detalles }`.

**Obtenido:** `400` · `{"error":"Datos inválidos","detalles":["prioridad inválida. Valores permitidos: P1, P2, P3."]}`. Los demás valores inválidos están en las excepciones.

### Otros criterios de HU-09

| Regla | Pasos | Obtenido | Estado |
|---|---|---|---|
| 1 · Filtro por estado | Estado **Cerrada** en la pantalla | #6 y #5 | ✅ |
| 1 · Filtros combinables | `?estado=Pendiente&area_id=3` | `200` · #8, #7 y #1 | ✅ |
| 1 · Un filtro vacío no restringe | `?tipo=&area_id=&prioridad=&categoria_id=&estado=` | `200` · los 8 casos | ✅ |
| 1 · Área y categoría | Área **Red y conectividad** + categoría **Internet** en la pantalla | #7 y #6 | ✅ |
| 1 · Tipo y prioridad | **Solicitud** + **P3** en la pantalla | Solo el #5 | ✅ |
| 3 · Sin filtros, del más reciente al más antiguo | `GET /api/casos` | `200` · #8, #7, #2, #1, #3, #6, #4, #5 | ✅ |
| 5 · Categoría que no pertenece al área | `?area_id=3&categoria_id=1` (Computador es de Hardware) | `200` con `[]`, sin error | ✅ |
| Arreglo de la #98 | Elegir Red y conectividad + Internet y volver el área a **Todas** | La categoría se reinicia y se deshabilita, y vuelven los 8 casos | ✅ |
| Compatibilidad con HU-02 | `?usuario_id=1&area_id=3` | `200` · #8 y #1 (solo los de Laura) | ✅ |
| Ver historial | En el #8 desde `/casos` | Abre la línea de tiempo con "Caso registrado" y se cierra con **Cerrar** | ✅ |
| Menú | Cambiar entre los usuarios de prueba | **Casos** solo aparece en el menú de Ana (administradora), junto a Indicadores y Categorías. No aparece para Laura, Diego ni Pedro | ✅ |

### Excepciones de HU-09

| Situación | Petición | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| `prioridad` fuera del dominio | `?prioridad=P9` | `400` | `400` · "prioridad inválida. Valores permitidos: P1, P2, P3." | ✅ |
| `tipo` fuera del dominio | `?tipo=Queja` y `?tipo=incidente` (en minúscula) | `400` | `400` · "tipo inválido. Valores permitidos: Incidente, Solicitud." | ✅ |
| `estado` fuera del dominio | `?estado=Inventado` | `400` | `400` · "estado inválido. Valores permitidos: Pendiente, En análisis, En atención, En validación, Cerrada." | ✅ |
| `area_id` no es entero positivo | `?area_id=abc`, `?area_id=0` y `?area_id=3 OR 1=1` | `400` | `400` · "area_id debe ser un entero positivo." | ✅ |
| `categoria_id` no es entero positivo | `?categoria_id=-1` y `?categoria_id=1.5` | `400` | `400` · "categoria_id debe ser un entero positivo." | ✅ |
| Área o categoría que no existen | `?area_id=99` y `?categoria_id=999` | `200` con lista vacía | `200` · `[]` | ✅ |
| Error de la base de datos | Se renombró la tabla temporalmente (`RENAME TABLE caso TO caso_x`) y se pidió `?tipo=Incidente&area_id=3&prioridad=P1` | `500` | `500` · `{"error":"Table 'campushelp.caso' doesn't exist","detalles":[]}`. Después se restauró la tabla y la petición volvió a responder `200`. | ✅ (ver observaciones) |

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo (`/api/health` → `db: up`). `GET /api/casos?tipo=Incidente&area_id=3&prioridad=P1` sigue respondiendo los casos 7 y 1, y `GET /api/casos` los 8. En MySQL hay 8 casos y 23 registros de historial: los 21 de los seeds y el evento `creacion` de los casos 7 y 8. ✅

### Observaciones

- **Con varios valores inválidos solo se informa el primero:** `?prioridad=P9&tipo=Queja` responde solo "tipo inválido…". Cumple el `400`, pero `detalles` podría listar todos los errores, como hace el registro de HU-01. No bloquea.
- **El `500` expone el mensaje interno de MySQL:** es la misma observación de HU-08 (`middlewares/errorHandler.js` devuelve `err.message`). No bloquea.
- **Las peticiones no se cancelan:** si se cambian varios selectores muy rápido, una respuesta vieja podría llegar después de una nueva (sugerencia de la auditoría de la #98). En esta ejecución no ocurrió.
- Con 11 columnas, la tabla necesita scroll horizontal en pantallas estrechas.
- Durante esta ejecución no aparecieron errores nuevos en la consola del navegador, y el log de la API no registró errores.

### Conclusión

HU-09 cumple CP-10, E2 a E4, las reglas 1, 3 y 5 y todas sus excepciones. La regla 2 se comprobó en las peticiones de la pantalla, y los filtros siguen funcionando después del reinicio. No se encontraron defectos. Candidatos a casos propios en la #38: una categoría que no pertenece al área devuelve una lista vacía, y quitar el área reinicia la categoría (defecto corregido en la auditoría de la #98).

---

## HU-10 · Indicadores (#102)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-13 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `9f992fa` (incluye #100 y #101) |
| Base de datos | MySQL 8.0.39 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos y 21 registros de historial al inicio) |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantalla `/indicadores`, usuario de prueba **Ana Admin** (id 6, administradora) |

Para comparar, cada indicador se calculó también con una consulta SQL independiente de la del backend: un `GROUP BY` directo sobre `caso` por cada grupo y los promedios con `TIMESTAMPDIFF(MINUTE, …) / 60`.

### E1 · Cada indicador coincide con una consulta SQL directa ✅

**Pasos:** con Ana, abrir `/indicadores`. Comparar la pantalla, `GET /api/indicadores` y la consulta SQL.

**Esperado:** cada total y cada promedio coincide con el SQL.

**Obtenido**

| Indicador | SQL directo | API | Pantalla |
|---|---|---|---|
| Total | 6 | 6 | 6 |
| Por estado | Pendiente 1 · En análisis 1 · En atención 1 · En validación 1 · Cerrada 2 | Igual | Igual |
| Por tipo | Incidente 4 · Solicitud 2 | Igual | Igual |
| Por prioridad | P1 2 · P2 3 · P3 1 | Igual | Igual |
| Por área | Hardware 1 · Software 1 · Red y conectividad 2 · Cuentas y acceso 1 · Plataformas académicas 1 | Igual | Igual |
| Creación → asignación | 7.0625 h sobre 4 casos (21.5 + 4.75 + 1 + 1) / 4 | `7.1`, `casos_asignados: 4` | "7.1 h · Sobre 4 casos asignados" |
| Creación → cierre | 41 h sobre 2 casos (32 + 50) / 2 | `41`, `casos_cerrados: 2` | "41.0 h · Sobre 2 casos cerrados" |

- El #2 está En análisis pero no tiene `fecha_asignacion`, así que no entra en el promedio de asignación (regla 3).
- Cada grupo lista todos sus valores: 5 estados, 2 tipos, 3 prioridades y 5 áreas (regla 2).
- Los promedios se muestran con un decimal (R1), y las barras son de CSS, sin librerías de gráficos (R2).

**Evidencia:** [`hu10-e1-indicadores.jpg`](../evidencias/pruebas/hu10-e1-indicadores.jpg) y [`hu10-e1-grupos.jpg`](../evidencias/pruebas/hu10-e1-grupos.jpg)

### E2 · Un caso nuevo sube los contadores ✅

**Pasos:** con el dashboard abierto, registrar por la API un caso para Laura (Solicitud, Plataformas académicas / Campus virtual, P3) y pulsar **Actualizar**.

**Esperado:** suben el total, Pendiente y los contadores de su tipo, prioridad y área.

**Obtenido:** `POST /api/casos` respondió `201` con el **#7** en `Pendiente`. Al pulsar **Actualizar**, sin recargar la página:

| Indicador | Antes | Después |
|---|---|---|
| Total | 6 | **7** |
| Pendiente | 1 | **2** |
| Solicitud | 2 | **3** |
| P3 | 1 | **2** |
| Plataformas académicas | 1 | **2** |
| Los demás contadores y los promedios | — | Sin cambios (7.1 h y 41.0 h) |

La consulta SQL directa dio los mismos valores.

**Evidencia:** [`hu10-e2-actualizar.jpg`](../evidencias/pruebas/hu10-e2-actualizar.jpg)

### E3 · Sin casos cerrados ✅

**Pasos:** dejar temporalmente la base sin casos cerrados: se respaldaron los casos 5 y 6 en una tabla auxiliar y se pasaron a `En validación` con `fecha_cierre = NULL`. Pulsar **Actualizar**.

**Esperado:** el promedio de cierre muestra "Sin datos" y no un error.

**Obtenido:** la API responde `200` con `"promedio_horas_cierre": null` y `"casos_cerrados": 0`. La tarjeta muestra **"Sin datos"** y "Sobre 0 casos cerrados", Cerrada aparece en 0 y En validación en 3. El promedio de asignación sigue en 7.1 h. Después se restauraron los casos 5 y 6 (`Cerrada` con su `fecha_cierre` original).

**Evidencia:** [`hu10-e3-sin-datos.jpg`](../evidencias/pruebas/hu10-e3-sin-datos.jpg)

### Otros criterios de HU-10

| Regla | Pasos | Obtenido | Estado |
|---|---|---|---|
| R4 · Área inactiva con casos | `UPDATE area SET activa = 0 WHERE id = 5` y `GET /api/indicadores` | Plataformas académicas sigue en `por_area` con 2, y la suma por área (7) es igual al total. Después se reactivó el área | ✅ |
| 1 · Se calcula en el momento | E2 y E3 | Los cambios en la BD se ven al pulsar **Actualizar**, sin guardar indicadores | ✅ |
| Redirección | Ir a `/dashboard` | Lleva a `/indicadores` | ✅ |
| Menú | Cambiar entre los usuarios de prueba | **Indicadores** solo aparece en el menú de Ana, junto a Casos y Categorías. Laura ve Registrar y Mis solicitudes, Diego la Bandeja y Pedro Por validar | ✅ (ver observaciones) |

### Excepciones de HU-10

| Situación | Petición | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| Error de la base de datos | Se renombró la tabla temporalmente (`RENAME TABLE caso TO caso_x`) y se pidió `GET /api/indicadores` | `500` | `500` · `{"error":"Table 'campushelp.caso' doesn't exist","detalles":[]}`. Al pulsar **Actualizar**, la pantalla muestra "No se pudieron cargar los indicadores.". Después se restauró la tabla, la API volvió a responder `200` y **Actualizar** cargó de nuevo los indicadores | ✅ (ver observaciones) |

**Evidencia:** [`hu10-error-bd.jpg`](../evidencias/pruebas/hu10-error-bd.jpg)

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo. La respuesta de `GET /api/indicadores` fue idéntica byte a byte a la de antes del reinicio (total 7). En MySQL hay 7 casos y 22 registros de historial: los 21 de los seeds y el evento `creacion` del #7. ✅

### Observaciones

- **La pantalla no restringe el acceso por rol:** el menú solo ofrece Indicadores al administrador, pero si Laura escribe `/indicadores` en la URL ve los indicadores. HU-10 no pide restringirlo, la autenticación es simulada y son datos agregados de solo lectura, así que no se registra como defecto. Si se quiere, se puede mostrar un aviso como el de Categorías.
- **El `500` expone el mensaje interno de MySQL:** es la misma observación de HU-08 y HU-09 (`middlewares/errorHandler.js` devuelve `err.message`). No bloquea.
- Durante esta ejecución no aparecieron errores nuevos en la consola del navegador, y el log de la API no registró errores fuera de la prueba del `500`.

### Conclusión

HU-10 cumple E1 a E3, las reglas 1 a 4 y la excepción del `500`: cada indicador coincide con una consulta SQL independiente, y los indicadores sobreviven al reinicio. No se encontraron defectos. Candidatos a casos propios en la #38: un caso nuevo sube los contadores (E2) y "Sin datos" sin casos cerrados (E3).

---

## HU-11 · Gestionar categorías (#105)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-13 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `834621b` (incluye #103 y #104) |
| Base de datos | MySQL 8.0.39 limpia, con `db/schema.sql` y `db/seeds.sql` (16 categorías y 6 casos al inicio) |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantallas `/categorias` y `/crear-caso`, usuarios de prueba **Ana Admin** (id 6, administradora) y **Laura Gómez** (id 1, solicitante) |

Primero se ejecutaron los escenarios por la API (un script de Python con `urllib`). Después se recargaron los seeds y se repitió el recorrido desde la interfaz.

### E1 · Una categoría nueva aparece en el registro ✅

**Pasos:** como Ana, en `/categorias`, crear "VPN" en Red y conectividad con la descripción "Acceso a la red privada virtual.". Después, como Laura, abrir `/crear-caso` y elegir Red y conectividad.

**Esperado:** VPN aparece en la lista y Laura puede elegirla al registrar un caso.

**Obtenido**

| Vía | Resultado |
|---|---|
| API | `POST /api/categorias` → `201` (id 17). VPN aparece en `GET /api/categorias?area_id=3`, y `POST /api/casos` de Laura con VPN → `201` (caso #7) |
| Pantalla | VPN aparece en Red y conectividad con el badge **Activa**, y el formulario se vacía. En `/crear-caso`, Laura ve Internet, Red cableada, **VPN** y Wi-Fi |

**Evidencia:** [`hu11-e1-crear.jpg`](../evidencias/pruebas/hu11-e1-crear.jpg) y [`hu11-e1-registro.jpg`](../evidencias/pruebas/hu11-e1-registro.jpg) (en la captura el selector de categoría se desplegó como lista para que se vean las opciones)

### E3 · Nombre duplicado en el área ✅

**Pasos:** crear otra vez VPN en Red y conectividad, renombrar Wi-Fi a "Internet" y crear VPN en otra área.

**Esperado:** `409` sin cambios en la BD. En otra área el nombre se acepta.

**Obtenido**

| Prueba | Resultado |
|---|---|
| Crear "VPN", "vpn" o "  VPN  " en el área 3 | `409` "Ya existe una categoría con ese nombre en el área." |
| `PUT` de Wi-Fi a "Internet" | `409`. Wi-Fi sigue igual en la BD |
| Crear "VPN" en Software | `201` (id 18): la unicidad es por área |
| Pantalla: crear "vpn" | El aviso aparece encima de la lista, sin ocultarla. La BD sigue con 17 categorías |
| Pantalla: editar Wi-Fi a "Internet" | El aviso aparece y el formulario de edición sigue abierto con los datos escritos. En la BD Wi-Fi no cambió |

**Evidencia:** [`hu11-e3-duplicado.jpg`](../evidencias/pruebas/hu11-e3-duplicado.jpg) y [`hu11-e3-renombrar.jpg`](../evidencias/pruebas/hu11-e3-renombrar.jpg)

### Editar conserva la descripción (regla 5) ✅

Caso pedido en la auditoría de la #104.

**Pasos:** como Ana, pulsar **Editar** en Wi-Fi, cambiar solo el nombre a "Wi-Fi campus" y guardar.

**Esperado:** el formulario precarga el nombre y la descripción, y la descripción se conserva.

**Obtenido:** el formulario precargó "Wi-Fi" y "Sin acceso al Wi-Fi institucional.". Al guardar, la lista muestra "Wi-Fi campus" con la misma descripción y el aviso del 409 anterior desaparece. En MySQL la fila 8 quedó con `nombre = 'Wi-Fi campus'` y la descripción original. Por la API, un `PUT` con `area_id: 1` responde `200` y el área sigue siendo la 3 (el área no se cambia).

**Evidencia:** [`hu11-e2-desactivar.jpg`](../evidencias/pruebas/hu11-e2-desactivar.jpg) (fila "Wi-Fi campus")

### E2 · Una categoría desactivada no aparece en el registro ✅

**Pasos:** como Ana, pulsar **Desactivar** en VPN. Después, como Laura, abrir `/crear-caso` y elegir Red y conectividad. Enviar también un caso con VPN por la API.

**Esperado:** VPN no aparece en el registro y la API responde `400`. Los casos existentes la conservan.

**Obtenido**

| Vía | Resultado |
|---|---|
| API | `PATCH` con `activa: false` → `200`. VPN sale de `GET /api/categorias?area_id=3` y sigue en `?todas=1` con `activa: false`. `POST /api/casos` con VPN → `400` "La categoría indicada está inactiva.". El caso #7 sigue con VPN (regla 4) |
| Pantalla | VPN muestra el badge **Inactiva** y el botón **Activar**. En `/crear-caso`, Laura solo ve Internet, Red cableada y Wi-Fi campus. En MySQL, `activa = 0` |

**Evidencia:** [`hu11-e2-desactivar.jpg`](../evidencias/pruebas/hu11-e2-desactivar.jpg) y [`hu11-e2-registro.jpg`](../evidencias/pruebas/hu11-e2-registro.jpg)

### E4 · Reactivar la categoría ✅

**Pasos:** como Ana, pulsar **Activar** en VPN y volver a `/crear-caso` como Laura.

**Esperado:** VPN vuelve a aparecer en el registro.

**Obtenido:** por la API, `PATCH` con `activa: true` → `200` y VPN vuelve a `?area_id=3`. En la pantalla VPN recupera el badge **Activa**, y Laura vuelve a ver Internet, Red cableada, **VPN** y Wi-Fi campus.

### E5 · Un usuario que no es administrador ✅

**Pasos:** intentar crear, editar y desactivar con usuarios que no son administradores, y abrir `/categorias` como Laura.

**Esperado:** `400` y sin cambios.

**Obtenido**

| Prueba | Resultado |
|---|---|
| Laura (solicitante), Diego (agente) y Pedro (validador) en `POST`, `PUT` y `PATCH` | `400` "Solo un usuario administrador activo gestiona categorías.". VPN no cambió |
| Sin `usuario_id`, con `"abc"` o con 999 | `400` |
| Ana inactiva temporalmente (`activa = 0`) | `400`. Después se reactivó |
| Pantalla como Laura | Aviso "Solo un administrador activo gestiona categorías (el backend lo exige)." y los 35 botones (Crear, Editar, Desactivar) deshabilitados |

**Evidencia:** [`hu11-e5-no-admin.jpg`](../evidencias/pruebas/hu11-e5-no-admin.jpg)

### Excepciones de HU-11

| Situación | Petición | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| Nombre inválido | "ab", 101 caracteres, "   " o sin nombre | `400` | `400` | ✅ |
| Nombre en el límite | 100 caracteres | `201` | `201` (id 19) | ✅ |
| Espacios sobrantes | "  Escáner  " | Se recorta | `201` (id 20), guardado como "Escáner". La descripción también se recorta | ✅ |
| Área inválida | Área 99, "abc" o área 5 inactiva | `400` | `400` | ✅ |
| Descripción larga | 256 caracteres | `400` | `400` | ✅ |
| Varios errores | Nombre corto y área inexistente | `400` con los dos | `400` con los dos mensajes en `detalles` | ✅ |
| `activa` no booleano | `"false"`, `0` o sin `activa` | `400` | `400` | ✅ |
| Categoría inexistente | `PUT` y `PATCH` sobre el id 999 | `404` | `404` | ✅ |
| Id inválido | `PUT` sobre `abc` | `400` | `400` | ✅ |
| Editar con nombre corto | `PUT` con "ab" | `400` | `400` | ✅ |
| Editar con su propio nombre | `PUT` de VPN con "VPN" | `200` | `200`: no cuenta como duplicado | ✅ |
| Error de la base de datos | Se renombró la tabla temporalmente (`RENAME TABLE categoria TO categoria_x`) y se pidieron `GET` y `POST` | `500` | `500` · `{"error":"Table 'campushelp.categoria' doesn't exist","detalles":[]}`. Después se restauró la tabla | ✅ (ver observaciones) |

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo. `GET /api/categorias?todas=1` devuelve 17 categorías, y en Red y conectividad siguen VPN (activa) y "Wi-Fi campus" con su descripción original. ✅

### Observaciones

- **Un `PUT` sin `descripcion` la deja en `NULL`:** es la semántica de reemplazo de `PUT`. La pantalla siempre envía la descripción precargada, así que desde la interfaz no se pierde (ver "Editar conserva la descripción"). Un cliente de la API debe enviar la descripción completa. No se registra como defecto.
- **El `500` expone el mensaje interno de MySQL:** es la misma observación de HU-08, HU-09 y HU-10 (`middlewares/errorHandler.js` devuelve `err.message`). No bloquea.
- En la consola del navegador solo aparecieron los dos `409` esperados del E3, y el log de la API no registró errores.

### Conclusión

HU-11 cumple E1 a E5, las reglas 1 a 5 y todas sus excepciones: las categorías creadas, editadas, desactivadas y reactivadas se reflejan en el formulario de registro, y los cambios sobreviven al reinicio. No se encontraron defectos. Candidatos a casos propios en la #38: editar solo el nombre conserva la descripción, y una categoría desactivada desaparece del registro pero los casos existentes la conservan.

---

## HU-12 · Detalle del caso (#108)

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-13 |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `90c172c` (incluye #106 y #107) |
| Base de datos | MySQL 8.0.39 limpia, con `db/schema.sql` y `db/seeds.sql` (6 casos, 4 atenciones y 21 eventos de historial al inicio) |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, pantallas `/mis-solicitudes` y `/mis-solicitudes/:id`, usuarios de prueba **Laura Gómez** (id 1) y **Carlos Ruiz** (id 2), solicitantes, y **Ana Admin** (id 6, administradora) |

Primero se ejecutaron los escenarios por la API (un script de Python con `urllib`). Después se repitió el recorrido desde la interfaz sobre la misma base.

### E1 · Caso propio cerrado ✅

**Pasos:** como Laura, abrir Mis Solicitudes, pulsar **Ver detalle** en el caso #5 (Cerrada) y pedir `GET /api/casos/5?usuario_id=1`.

**Esperado:** se ven los datos del caso, la solución, el agente y el historial.

**Obtenido**

| Vía | Resultado |
|---|---|
| API | `200` con todos los campos: descripción, Laura Gómez como solicitante, Diego Torres como agente, `fecha_creacion`, `fecha_asignacion` y `fecha_cierre`. `atenciones` trae la atención 3 con su diagnóstico, solución, agente y fecha. `GET /api/casos/5/historial?usuario_id=1` → `200` con 5 eventos: `creacion`, `asignacion`, `cambio_estado`, `envio_validacion` y `cierre` |
| Pantalla | Mis Solicitudes enlaza a `/mis-solicitudes/1`, `/3` y `/5`. El detalle del #5 muestra el título, "Solicitud · Plataformas académicas / Campus virtual", los badges P3 y **Cerrada**, la descripción, Solicitante Laura Gómez, Agente Diego Torres y las fechas Creado 5/10/26 8:00 a. m., Asignado 9:00 a. m. y Cierre 6/10/26 4:00 p. m. "Atenciones (1)" muestra el diagnóstico y la solución firmados por "Diego Torres · 6/10/26, 3:00 p. m.", y el historial va de "Caso registrado" a "Caso cerrado" (Pedro Validador) |

**Evidencia:** [`hu12-e1-detalle.jpg`](../evidencias/pruebas/hu12-e1-detalle.jpg) y [`hu12-e1-historial.jpg`](../evidencias/pruebas/hu12-e1-historial.jpg)

### E2 · Caso ajeno ✅

**Pasos:** como Laura, escribir en la URL `/mis-solicitudes/6` (caso de Carlos) y pedir el caso por la API.

**Esperado:** `404` por la API y "Caso no encontrado" en la pantalla.

**Obtenido**

| Prueba | Resultado |
|---|---|
| API: Laura pide el #6 o el #4, Carlos pide el #5 | `404` · `{"error":"Caso no encontrado","detalles":["No existe un caso con id N."]}`. Es la misma respuesta que para un caso que no existe (decisión R3) |
| API: caso 999 | `404` con el mismo mensaje |
| Pantalla: Laura en `/mis-solicitudes/6` | "Caso no encontrado", sin datos del caso |
| Pantalla: `/mis-solicitudes/999` y `/mis-solicitudes/abc` | "Caso no encontrado" |
| Pantalla: estando en el #5, cambiar a Carlos en el selector | La página vuelve a pedir el caso y muestra "Caso no encontrado" |

**Evidencia:** [`hu12-e2-ajeno.jpg`](../evidencias/pruebas/hu12-e2-ajeno.jpg)

### E3 · Caso propio sin atenciones ✅

**Pasos:** como Laura, abrir el detalle del caso #1 (Pendiente, sin agente) y pedirlo por la API.

**Esperado:** se ven los datos y el mensaje "Aún no hay atenciones registradas".

**Obtenido:** la API responde `200` con `atenciones: []`, y `agente`, `fecha_asignacion` y `fecha_cierre` en `null`. La pantalla muestra los datos con los badges P1 y **Pendiente**, Agente "Sin asignar", Asignado y Cierre en "—", "Atenciones (0)" con **"Aún no hay atenciones registradas"**, y el historial con el evento "Caso registrado".

**Evidencia:** [`hu12-e3-sin-atenciones.jpg`](../evidencias/pruebas/hu12-e3-sin-atenciones.jpg)

### Otros criterios de HU-12

| Regla | Prueba | Resultado | Estado |
|---|---|---|---|
| 1 · Varias atenciones en orden | El validador devolvió el #4 de Carlos (`200`) y María registró una segunda atención (`201`). Después, `GET /api/casos/4?usuario_id=2` | `200`, En atención, con las atenciones 2 (6/10) y 5 (13/10) en orden cronológico. Los ids y las claves coinciden con `GET /api/casos/4/atenciones`. En la pantalla, "Atenciones (2)" en ese orden y el historial termina con la devolución (con su motivo) y la atención registrada | ✅ |
| 2 · Otros roles ven cualquier caso | Diego (agente), María (agente), Pedro (validador) y Ana (administradora) piden el #6 | `200` en los cuatro. En la pantalla, Ana ve el #5 completo | ✅ |
| 4 · Solo lectura | `PUT`, `PATCH` y `DELETE` sobre `/api/casos/5` | `404`: no existen esas rutas. La pantalla no tiene controles de edición | ✅ |
| Navegación | **← Volver** desde el detalle | Regresa a `/mis-solicitudes` | ✅ |

### Excepciones de HU-12

| Situación | Petición | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| Caso inexistente o ajeno | id 999, o el #6 pedido por Laura | `404` | `404` "Caso no encontrado" | ✅ |
| Id inválido | id `abc`, `0` o `-1` | `400` | `400` "Datos inválidos" · "El id del caso y usuario_id deben ser enteros positivos." | ✅ |
| `usuario_id` inválido | Sin `usuario_id`, con `abc` o con `0` | `400` | `400` con el mismo detalle | ✅ |
| Usuario inexistente | `usuario_id=999` | `400` | `400` "El usuario indicado no existe o está inactivo." | ✅ |
| Usuario inactivo | Laura inactiva temporalmente (`activo = 0`) | `400` | `400` con el mismo mensaje. Después se reactivó | ✅ |
| Error de la base de datos | Se renombró la tabla temporalmente (`RENAME TABLE atencion TO atencion_x`) y se pidió el #5 | `500` | `500` · `{"error":"Table 'campushelp.atencion' doesn't exist","detalles":[]}`. Después se restauró la tabla y volvió a responder `200` | ✅ (ver observaciones) |

### Prueba de reinicio

Se detuvieron el backend y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo. `GET /api/casos/4?usuario_id=2` sigue En atención con las atenciones 2 y 5, el #5 sigue Cerrada con su `fecha_cierre` y una atención, y Laura sigue recibiendo `404` al pedir el #6. En la pantalla, Carlos ve el #4 con "Atenciones (2)". ✅

### Defecto encontrado

**DEF-03 (#123) · El detalle del caso muestra "Caso no encontrado" ante cualquier error** (P3)

| Campo | Valor |
|---|---|
| Pasos | 1. Provocar un error del servidor: `RENAME TABLE atencion TO atencion_x`. 2. Con Ana (o Laura), abrir `/mis-solicitudes/5`. 3. Restaurar la tabla. |
| Esperado | "Caso no encontrado" solo con el `404`. En los demás casos, el mensaje de la API o "No se pudo cargar el caso". |
| Obtenido | La API responde `500` y la pantalla muestra "Caso no encontrado", igual que con un caso inexistente o ajeno. |
| Causa | El `catch` de `frontend/src/pages/DetalleMiCaso.tsx:36` asigna siempre "Caso no encontrado", sin mirar el código de la respuesta. |
| Impacto | Bajo: no impide el flujo ni expone datos de otros usuarios. Se reportó como observación en la auditoría de la #107 (PR #118), que se fusionó sin corregirlo, y se registró como defecto al cerrar el sprint. |
| Corrección | PR #125, fusionado el 2026-10-13. Un `404` o un id no numérico muestran "Caso no encontrado"; otro `4xx`, el mensaje de la API; un `5xx` o un fallo de red, "No se pudo cargar el caso. Intenta de nuevo.". El PR también retiró una redirección por rol que sacaba del detalle a administrador, agente y validador. |
| Verificación | Con los pasos de arriba la pantalla muestra "No se pudo cargar el caso. Intenta de nuevo.". Laura sigue viendo "Caso no encontrado" en `/mis-solicitudes/6`, `/999` y `/abc`, y Ana y Diego ven el #5 completo. ✅ |
| Estado | Cerrado (2026-10-13) |

### Observaciones

- **El `500` expone el mensaje interno de MySQL:** es la misma observación de HU-08 a HU-11 (`middlewares/errorHandler.js` devuelve `err.message`). No bloquea.
- **Historial de un caso ajeno:** al cambiar a Carlos estando en el #5, el historial también se pide y responde `404`. La pantalla no muestra nada de ese historial.
- En la consola del navegador solo aparecieron los `400`, `404` y `500` provocados por las pruebas, y el log de la API no registró errores.

### Conclusión

HU-12 cumple E1 a E3, las reglas 1 a 4 y todas sus excepciones: el solicitante ve el detalle completo de sus casos, con atenciones e historial, no puede ver los casos de otros, y los datos sobreviven al reinicio. No se encontraron defectos críticos; se registró un defecto de la interfaz que no es crítico (DEF-03, #123), que se corrigió con el PR #125. Candidatos a casos propios en la #38: un solicitante no puede ver un caso ajeno escribiendo la URL (E2), y un caso devuelto muestra todas sus atenciones en orden.

---

## Casos propios (#38)

Casos de prueba adicionales a los diez obligatorios. Cada uno está vinculado a un criterio de aceptación o a una regla de negocio, y cubre algo que los CP obligatorios no prueban: una barrera del backend, un caso límite o la concurrencia.

**Entorno de la ejecución**

| Campo | Valor |
|---|---|
| Fecha | 2026-10-13, de 11:45 a 11:50 (hora local) |
| Ejecutó | @jAlejandro423 (QA) |
| Versión | `develop` en `fa06599` (incluye todas las HU y las correcciones de DEF-01, DEF-02 y DEF-03) |
| Base de datos | MySQL 8.0 limpia, con `db/schema.sql` y `db/seeds.sql` cargados (6 casos, 21 registros de historial y 4 atenciones al inicio) |
| Backend | `node src/server.js` · `GET /api/health` → `{"status":"ok","db":"up"}` |
| Frontend | Vite, con Laura Gómez (id 1, solicitante) y Ana Admin (id 6, administradora) |

Las peticiones a la API se hicieron con un script de Node (`fetch`) que cuenta las filas de `caso`, `historial` y `atencion` antes y después de cada caso.

| CP | Caso | Criterio que verifica |
|---|---|---|
| CP-11 | Categoría de otra área | HU-01 · E4: la categoría debe pertenecer al área |
| CP-12 | Un agente no asignado registra una atención | HU-06 · E2: solo el agente asignado registra la atención |
| CP-13 | Devolución sin motivo | HU-07 · E3: la devolución exige un motivo de al menos 10 caracteres |
| CP-14 | Un caso cerrado no cambia | HU-05: un caso `Cerrada` no puede cambiar (también por asignación, atención o validación) |
| CP-15 | Una categoría desactivada no aparece en el registro | HU-11 · E2: una categoría inactiva no se ofrece ni se acepta al registrar |
| CP-16 | Un solicitante no ve un caso ajeno por URL | HU-12 · E2 y HU-08 · E3: el solicitante solo ve sus casos |
| CP-17 | Dos validaciones simultáneas del mismo caso | HU-07 · E4: solo se valida un caso `En validación` (bloqueo `FOR UPDATE`) |
| CP-18 | Un caso devuelto muestra todas sus atenciones en orden | HU-12 · E1, HU-07 · E2 y HU-08 · E2: el detalle conserva cada atención y la devolución con su motivo |

### CP-11 · Categoría de otra área (HU-01 · E4) ✅

**Pasos:** `POST /api/casos` con Laura y datos válidos, salvo una categoría que no pertenece al área, en tres combinaciones: Hardware + Wi-Fi (`area_id: 1`, `categoria_id: 8`), Red y conectividad + Computador (3, 1) y Plataformas académicas + Contraseña (5, 11). En la interfaz, elegir un área en `/crear-caso` y revisar las categorías que ofrece.

**Esperado:** se rechaza con `400` y no se crea ninguna fila. La interfaz solo ofrece las categorías del área elegida.

**Obtenido**
- Las tres combinaciones responden:

  ```json
  HTTP 400
  { "error": "Datos inválidos", "detalles": ["La categoría no pertenece al área indicada."] }
  ```

- Antes y después: 6 casos, 21 registros de historial y 4 atenciones.
- En `/crear-caso`, con el área Hardware la lista de categorías es solo Computador, Impresora, Periférico y Proyector, así que desde la interfaz no se puede elegir una categoría de otra área.

### CP-12 · Un agente no asignado registra una atención (HU-06 · E2) ✅

**Pasos:** el caso #3 está `En atención` y asignado a Diego Torres (id 3). Enviar `POST /api/casos/3/atenciones` con diagnóstico y solución válidos, primero como María Prieto (id 4, agente no asignada) y después como Laura Gómez (id 1, solicitante).

**Esperado:** se rechaza y no se guarda la atención.

**Obtenido**
- María: `409` · `"Solo el agente asignado registra la atención."`.
- Laura: `400` · `detalles: ["El usuario debe existir, estar activo y tener rol agente."]`.
- El caso #3 sigue `En atención` con `agente_id = 3`. Antes y después: 4 atenciones y 21 registros de historial.

### CP-13 · Devolución sin motivo (HU-07 · E3) ✅

**Pasos:** el caso #4 está `En validación`. Enviar `POST /api/casos/4/validacion` como Pedro Validador (id 5), con `accion: "devolver"`, en cuatro variantes: sin `motivo`, con `""`, con nueve espacios y con `Incomplet` (9 caracteres).

**Esperado:** se rechaza con `400` y el caso no cambia.

**Obtenido**
- Las cuatro variantes responden `400` · `detalles: ["El motivo de devolución mínimo es de 10 caracteres."]`.
- El caso #4 sigue `En validación`, sin `fecha_cierre`, y el historial sigue con 21 registros.

### CP-14 · Un caso cerrado no cambia (HU-05) ✅

**Pasos:** el caso #5 está `Cerrada`. Intentar cambiarlo por cada endpoint que escribe en un caso:
1. `PATCH /api/casos/5/estado` a `En atención`, a `Pendiente` y a `Cerrada` (Diego, id 3).
2. `PATCH /api/casos/5/asignar` (María, id 4).
3. `POST /api/casos/5/atenciones` (Diego, el agente del caso).
4. `POST /api/casos/5/validacion` con `aprobar` y con `devolver` y un motivo válido (Pedro, id 5).

**Esperado:** todas se rechazan y el caso, su `fecha_cierre` y el historial quedan iguales.

**Obtenido**

| Petición | Respuesta |
|---|---|
| Estado → `En atención`, `Pendiente` o `Cerrada` | `409` · "El caso está Cerrado y no puede cambiar." |
| Asignar | `409` · "El caso ya tiene un agente asignado." |
| Atención | `409` · "Solo se registra atención en un caso En atención." |
| Aprobar o devolver | `409` · "Solo se validan casos En validación (está Cerrada)." |

- La fila del caso #5 es idéntica antes y después (`Cerrada`, `agente_id = 3`, `fecha_cierre = 2026-10-06 16:00:00`). Antes y después: 21 registros de historial y 4 atenciones.

### CP-15 · Una categoría desactivada no aparece en el registro (HU-11 · E2) ✅

**Pasos**
1. Como Ana Admin, desactivar Wi-Fi: `PATCH /api/categorias/8` con `activa: false`.
2. Revisar `GET /api/categorias?area_id=3`, la pantalla **Categorías** y las opciones de `/crear-caso` con el área Red y conectividad.
3. Intentar `POST /api/casos` con `categoria_id: 8`.
4. Reactivar Wi-Fi desde la pantalla **Categorías** (botón **Activar**).

**Esperado:** la categoría inactiva no se ofrece ni se acepta. Los casos que ya la usan la conservan.

**Obtenido**
- `PATCH` → `200` con `activa: false`. La pantalla **Categorías** muestra Wi-Fi con la etiqueta **Inactiva** y el botón **Activar**.
- `GET /api/categorias?area_id=3` devuelve solo Internet y Red cableada, y `/crear-caso` ofrece solo esas dos.
- `POST` → `400` · `detalles: ["La categoría indicada está inactiva."]`. No se crean filas.
- El caso #1, que ya era de Wi-Fi, conserva `categoria_id = 8`.
- Al pulsar **Activar**, MySQL vuelve a `activa = 1` y la API vuelve a listar Wi-Fi.

**Evidencia:** [`cp15-categoria-inactiva.jpg`](../evidencias/pruebas/cp15-categoria-inactiva.jpg)

### CP-16 · Un solicitante no ve un caso ajeno por URL (HU-12 · E2 y HU-08 · E3) ✅

**Pasos:** el caso #6 es de Carlos Ruiz (id 2). Como Laura (id 1):
1. Pedir `GET /api/casos/6`, `/api/casos/6/historial` y `/api/casos/6/atenciones` con `usuario_id=1`.
2. Escribir en el navegador `/mis-solicitudes/6`.
3. Revisar `GET /api/casos?usuario_id=1`.

**Esperado:** `404` en las tres peticiones, la pantalla no muestra datos del caso y la lista de Laura no lo incluye.

**Obtenido**
- Las tres peticiones responden `404` · `"Caso no encontrado"`. Con `usuario_id=2` (Carlos) el detalle responde `200`.
- La pantalla muestra "Detalle del caso #6" y **"Caso no encontrado"**, sin ningún dato del caso.
- **Mis casos** de Laura devuelve los casos 1, 3 y 5.
- En la consola del navegador solo aparecen el `404` y el registro del error que deja la pantalla de detalle.

**Evidencia:** [`cp16-caso-ajeno.jpg`](../evidencias/pruebas/cp16-caso-ajeno.jpg)

### CP-17 · Dos validaciones simultáneas del mismo caso (HU-07 · E4) ✅

**Pasos:** con el caso #4 `En validación`, enviar a la vez (`Promise.all`) dos peticiones de Pedro: `aprobar` y `devolver` con un motivo válido.

**Esperado:** solo una tiene efecto. La otra recibe `409`, y en el historial queda un único evento.

**Obtenido**
- `aprobar` → `200` y el caso queda `Cerrada` con `fecha_cierre = 2026-10-13 11:46:25`.
- `devolver` → `409` · "Solo se validan casos En validación (está Cerrada)."
- El historial pasa de 21 a 22 registros: un solo evento `cierre` (`En validación → Cerrada`) y ninguna `devolucion`.

### CP-18 · Un caso devuelto muestra todas sus atenciones en orden (HU-12 · E1, HU-07 · E2 y HU-08 · E2) ✅

**Pasos**
1. Laura registra el caso #7 (Incidente, Software / Error, P2).
2. Diego se lo asigna, lo pasa a `En atención`, registra la atención 1 y lo envía a validación.
3. Pedro lo devuelve con el motivo `El error sigue apareciendo desde otro navegador.`.
4. Diego registra la atención 2 y lo envía de nuevo a validación.
5. Pedro lo aprueba con el motivo opcional `Verificado con el usuario desde dos navegadores.`.
6. Laura abre `/mis-solicitudes/7`.

**Esperado:** el detalle muestra las dos atenciones en orden, la devolución con su motivo y el cierre. La aprobación guarda su motivo y la `fecha_cierre`.

**Obtenido**
- Cada paso respondió `200` o `201`. El caso #7 queda `Cerrada`, con `fecha_cierre = 2026-10-13 11:47:35`.
- `GET /api/casos/7?usuario_id=1` devuelve las atenciones 5 (11:47:29) y 6 (11:47:32), en ese orden y las dos de Diego Torres.
- El historial tiene 9 eventos en orden: `creacion`, `asignacion`, `cambio_estado`, `atencion`, `envio_validacion`, `devolucion` (con el motivo), `atencion`, `envio_validacion` y `cierre`, con el motivo de la aprobación en `detalle`.
- La pantalla muestra **Atenciones (2)** en el mismo orden y el historial completo, con "Devuelto: El error sigue apareciendo desde otro navegador." y "Verificado con el usuario desde dos navegadores." en el cierre.

**Evidencia:** [`cp18-atenciones-devolucion.jpg`](../evidencias/pruebas/cp18-atenciones-devolucion.jpg)

### Prueba de reinicio

Se detuvieron la API y MySQL (`mysqladmin shutdown`) y se arrancaron de nuevo (`Uptime` = 5 s, `/api/health` con `db: up`). MySQL conserva 7 casos, 31 registros de historial y 6 atenciones. Los casos #4 y #7 siguen `Cerrada` con su `fecha_cierre`, el #5 sigue igual y Wi-Fi sigue activa. La API devuelve el #7 con sus dos atenciones. ✅

### Observaciones

- **CP-14:** la asignación de un caso cerrado se rechaza con "El caso ya tiene un agente asignado." porque esa comprobación va antes que la del estado. El caso no cambia, así que no es un defecto. Un caso `Cerrada` sin agente no puede existir, porque para cerrar hace falta una atención del agente asignado.
- **CP-12:** el solicitante recibe `400` y no `409` porque se valida el rol antes de mirar el caso. Es coherente con las demás rutas.
- El log de la API no registró errores durante la ejecución.

### Conclusión

Los ocho casos propios (CP-11 a CP-18) pasan. Las reglas que protegen el flujo están en el backend: la categoría debe pertenecer al área y estar activa, solo el agente asignado atiende, la devolución exige motivo, un caso cerrado no cambia por ningún endpoint y dos validaciones simultáneas no se pisan. No se encontraron defectos nuevos.

---

## Registro consolidado de defectos (#38)

Todos los defectos tienen una issue con la label `defecto`. Los mismos datos están en la pestaña **Defectos** de [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx), con las fechas de detección y cierre.

| ID | Issue | Sprint | HU | Descripción | Pasos | Resultado esperado | Resultado obtenido | Prioridad | Estado | Corrección |
|---|---|---|---|---|---|---|---|---|---|---|
| DEF-01 | #56 | 1 | HU-02, HU-03 y HU-05 | Tildes corruptas al cargar `schema.sql` y `seeds.sql` en Windows: falta `SET NAMES utf8mb4` y el `ENUM` de `caso.estado` queda mal guardado. | 1. Cargar los scripts con el cliente `mysql` de Windows, sin `--default-character-set`. 2. `SELECT @@character_set_client` (cp850). 3. Consultar el usuario 1 y `SHOW COLUMNS` de `caso.estado`. | "Laura Gómez" y los valores del `ENUM` con tildes correctas. | Nombres corruptos ("Laura G├│mez") y `ENUM` corrupto: el cambio a `En análisis` fallaría (rompe CP-04). | P1 | Cerrado (2026-10-09) | PR #59 |
| DEF-02 | #93 | 2 | HU-07 | Después de un error de validación (`400` o `409`), la pantalla **Por validar** reemplaza toda la lista por el mensaje y oculta los demás casos hasta recargar. | 1. Con Pedro abrir `/por-validar` con dos casos `En validación`. 2. Cerrar uno por API o desde otra pestaña. 3. Pulsar **Aprobar** en ese caso. | Se muestra el mensaje del `409` y el otro caso sigue en la lista. | Solo se ve "Solo se validan casos En validación (está Cerrada).", y el otro caso deja de verse aunque sigue `En validación`. | P3 | Cerrado (2026-10-13) | PR #110 |
| DEF-03 | #123 | 3 | HU-12 | El detalle del caso muestra "Caso no encontrado" ante cualquier error (`500` o fallo de red), no solo ante el `404`. | 1. `RENAME TABLE atencion TO atencion_x`. 2. Con Laura abrir `/mis-solicitudes/5`. 3. Restaurar la tabla. | "Caso no encontrado" solo con el `404`. En los demás casos, el mensaje de la API o "No se pudo cargar el caso". | La API responde `500` y la pantalla muestra "Caso no encontrado". | P3 | Cerrado (2026-10-13) | PR #125 |

**Resumen:** 3 defectos registrados (uno P1 y dos P3), uno por sprint, y ninguno abierto, así que se cumple el punto de la DoD "sin defectos críticos abiertos". Los casos propios CP-11 a CP-18 no encontraron defectos nuevos.
