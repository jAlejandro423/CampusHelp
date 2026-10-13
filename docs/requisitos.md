# Documento de requisitos – CampusHelp

> Issue #40. Reúne en un solo lugar lo que pide el producto y dónde está el detalle de cada parte.
> Fuentes:
> - [políticas](politicas.md)
> - [fichas de las historias](historias/)
> - [decisiones técnicas](decisiones.md)
> - [matriz de trazabilidad](trazabilidad.md)
> - [casos de prueba](pruebas/casos_de_prueba.md)
> - issues y milestones del repositorio
>
> Estado al 2026-10-13.

## 1. Propósito y alcance

**CampusHelp** es una aplicación web para gestionar los incidentes y las solicitudes de servicio tecnológico de una universidad.

**Product Goal** ([políticas](politicas.md)):

> Entregar el 13 de octubre de 2026 un MVP web de CampusHelp que permita gestionar de extremo a extremo los incidentes y solicitudes de servicio tecnológico de la universidad: **Registrar → Clasificar → Priorizar → Asignar → Atender → Validar → Cerrar**, con persistencia en MySQL, historial completo e indicadores calculados sobre datos reales.

**Dentro del alcance:**
- el flujo completo de un caso;
- la clasificación por tipo, área y categoría, y la prioridad;
- el historial de cada caso;
- filtros, indicadores y gestión de categorías;
- usuarios de prueba por rol.

**Fuera del alcance** (restricciones del taller):
- autenticación real;
- integraciones externas (correo, WhatsApp, etc.);
- datos en memoria o simulados.

## 2. Actores

| Actor | Usuarios de prueba | Responsabilidad | Historias |
|---|---|---|---|
| Solicitante | Laura Gómez (1), Carlos Ruiz (2) | Registra casos y consulta los suyos, con su detalle y su solución | HU-01, HU-02, HU-08, HU-12 |
| Agente de soporte | Diego Torres (3), María Prieto (4) | Toma trabajo de la bandeja, se asigna casos, cambia su estado y registra el diagnóstico y la solución | HU-03, HU-04, HU-05, HU-06, HU-08 |
| Validador | Pedro Validador (5) | Aprueba la solución (cierra el caso) o la devuelve con un motivo | HU-07, HU-08 |
| Administrador | Ana Admin (6) | Filtra los casos, consulta los indicadores y gestiona las categorías | HU-08, HU-09, HU-10, HU-11 |

El actor se elige con el selector de usuario de prueba ([D-02](decisiones.md)). El backend comprueba el rol en cada operación con el `usuario_id` que recibe ([D-08](decisiones.md)).

## 3. Requisitos funcionales: Product Backlog

Prioridad: **P1** urgente · **P2** normal · **P3** baja. Puntos en Story Points (Fibonacci).

La fecha de Done es el cierre de la issue de la historia en GitHub, en hora de Colombia (UTC−5).

| HU | Historia (Como… quiero… para…) | Prioridad | Puntos | Sprint | Aceptación (resumen; los escenarios completos están en la ficha) | Estado |
|---|---|---|---|---|---|---|
| [HU-01](historias/HU-01.md) | Como solicitante quiero registrar un incidente o una solicitud **para** pedir atención a la mesa de servicios | P1 | 5 | 1 | Tipo, área, categoría del área, título y prioridad obligatorios. Descripción de al menos 10 caracteres. Queda `Pendiente` con fecha automática y evento `creacion`, y persiste tras reiniciar (6 escenarios). | ✅ Done (2026-10-09) |
| [HU-02](historias/HU-02.md) | Como solicitante quiero consultar mis casos **para** conocer su estado | P1 | 3 | 1 | Solo ve sus casos, con su estado actual. Estado vacío si no tiene casos (4 escenarios). | ✅ Done (2026-10-10) |
| [HU-03](historias/HU-03.md) | Como agente quiero ver la bandeja de casos pendientes **para** seleccionar el trabajo | P1 | 3 | 1 | Casos no cerrados, primero por prioridad y luego por antigüedad (4 escenarios). | ✅ Done (2026-10-10) |
| [HU-05](historias/HU-05.md) | Como agente quiero cambiar el estado de un caso **para** reflejar su avance | P1 | 5 | 1 | Solo las transiciones del mapa. Las demás responden `409`. Cada cambio deja historial en la misma transacción. Un caso `Cerrada` no cambia (5 escenarios). | ✅ Done (2026-10-10) |
| [HU-04](historias/HU-04.md) | Como agente quiero asignarme un caso **para** asumir su atención | P1 | 3 | 2 | Guarda el agente y `fecha_asignacion`, pasa de `Pendiente` a `En análisis` y registra `asignacion`. Un caso ya asignado a otro agente se rechaza (`409`), y sin agente no se pasa a `En atención` (5 escenarios). | ✅ Done (2026-10-12) |
| [HU-06](historias/HU-06.md) | Como agente asignado quiero registrar el diagnóstico y la solución **para** dejar constancia y enviar a validación | P1 | 5 | 2 | Solo el agente asignado y con el caso `En atención`. Sin una atención con solución no se pasa a `En validación` (5 escenarios). | ✅ Done (2026-10-12) |
| [HU-07](historias/HU-07.md) | Como validador quiero aprobar o devolver una solución **para** cerrar solo lo resuelto | P1 | 5 | 2 | Aprobar cierra el caso y guarda `fecha_cierre`. Devolver exige un motivo, vuelve a `En atención` y guarda el motivo en el historial (5 escenarios). | ✅ Done (2026-10-12) |
| [HU-08](historias/HU-08.md) | Como usuario quiero ver el historial de un caso **para** saber qué pasó, quién y cuándo | P2 | 5 | 2 | Eventos en orden cronológico con usuario, fecha, estados y detalle. El solicitante solo ve los de sus casos (4 escenarios). | ✅ Done (2026-10-12) |
| [HU-09](historias/HU-09.md) | Como administrador quiero filtrar los casos **para** encontrarlos rápidamente | P2 | 3 | 3 | Filtros por estado, tipo, área, categoría y prioridad, combinables con AND en el backend. Un valor fuera del dominio responde `400` (4 escenarios). | ✅ Done (2026-10-13) |
| [HU-10](historias/HU-10.md) | Como administrador quiero ver indicadores del servicio **para** conocer cómo se comporta la atención | P2 | 5 | 3 | Totales por estado, tipo, prioridad y área, y tiempos promedio de asignación y cierre, calculados sobre los datos reales (3 escenarios). | ✅ Done (2026-10-13) |
| [HU-11](historias/HU-11.md) | Como administrador quiero crear, editar y activar o desactivar categorías **para** mantener al día la clasificación | P2 | 3 | 3 | Nombre único por área. Las categorías se desactivan, no se borran, y las inactivas no se ofrecen al registrar (5 escenarios). | ✅ Done (2026-10-13) |
| [HU-12](historias/HU-12.md) | Como solicitante quiero ver el detalle de mi caso y la solución **para** saber cómo se resolvió | P3 | 3 | 3 | Detalle con descripción, fechas, atenciones e historial. Un caso ajeno responde `404` (3 escenarios). | ✅ Done (2026-10-13) |
| | **Total** | | **50** | | | **12 / 12 Done** |

Por sprint: Sprint 1, 16 puntos · Sprint 2, 18 · Sprint 3, 14 ([políticas](politicas.md)).

### Defectos que entraron al backlog

| ID | Issue | Prioridad | Descripción breve | Estado |
|---|---|---|---|---|
| DEF-01 | #56 | P1 | El cliente `mysql` de Windows corrompía las tildes de los scripts SQL | Cerrado el 2026-10-09 (PR #59) |
| DEF-02 | #93 | P3 | La lista de Por validar desaparecía después de un error de validación | Cerrado el 2026-10-13 (PR #110) |
| DEF-03 | #123 | P3 | El detalle del caso mostraba "Caso no encontrado" ante un `500` | Cerrado el 2026-10-13 (PR #125) |

## 4. Reglas de negocio

Las 16 reglas (RN-01 a RN-16) están en la [matriz de trazabilidad](trazabilidad.md#reglas-de-negocio), con el lugar donde se aplica cada una. Todas se validan en el **backend**; el frontend solo valida para mejorar la experiencia.

**Clasificación**
- **Tipo:** `Incidente` (interrupción o degradación de un servicio) o `Solicitud` (petición de una acción o servicio).
- **Áreas y categorías iniciales:**

| Área | Categorías iniciales |
|---|---|
| Hardware | Computador, Periférico, Proyector, Impresora |
| Software | Instalación, Error, Actualización |
| Red y conectividad | Wi-Fi, Internet, Red cableada |
| Cuentas y acceso | Contraseña, Bloqueo, Correo, Permisos |
| Plataformas académicas | Campus virtual, Sistema académico |

**Estados** (máquina única en `backend/src/services/estados.js`, [D-13](decisiones.md)):

```
Pendiente → En análisis → En atención → En validación → Cerrada
                              ↑               │
                              └── devolución ─┘
```

- Asignarse un caso `Pendiente` lo pasa a `En análisis` ([D-14](decisiones.md)).
- Para pasar a `En atención` hace falta un agente asignado (RN-11).
- Para pasar a `En validación` hace falta una atención con solución (RN-12).
- Solo la validación cierra o devuelve un caso (RN-08). Un caso `Cerrada` no cambia (RN-09).
- Todo cambio de estado, asignación, atención o creación deja un registro en `historial` en la misma transacción (RN-10).

## 5. Requisitos no funcionales

| ID | Requisito | Cómo se cumple | Evidencia |
|---|---|---|---|
| RNF-01 | Persistencia real: los datos sobreviven a un reinicio | MySQL 8. No hay datos en memoria. | Escenario E5 de HU-01, CP-11 a CP-18 y prueba del [README](../README.md) |
| RNF-02 | Integridad de los cambios | Transacciones con historial. Bloqueo de fila (`SELECT … FOR UPDATE`) al cambiar el estado, asignar, atender y validar. | CP-04 y CP-17 |
| RNF-03 | Seguridad básica | Consultas parametrizadas (`mysql2/promise`). `.env` fuera del repo. Un caso ajeno responde `404` sin revelar que existe. | Auditorías de los PR y CP-16 |
| RNF-04 | Errores uniformes | `{ "error", "detalles" }` con 400, 404, 409 o 500. | [D-05](decisiones.md) y [D-08](decisiones.md) |
| RNF-05 | Usabilidad | Menú por rol, solo los botones válidos para cada estado, mensajes de error del backend en la interfaz. | Reviews de los sprints |
| RNF-06 | Instalación reproducible | `schema.sql` y `seeds.sql` idempotentes y un README paso a paso. | [README](../README.md) (#39) |
| RNF-07 | Codificación | `utf8mb4` de extremo a extremo, `SET NAMES` en los scripts. | [D-12](decisiones.md) (DEF-01) |

## 6. Trazabilidad HU ↔ CP ↔ endpoints ↔ pantallas

La matriz completa, con reglas e issues, está en [`trazabilidad.md`](trazabilidad.md). Esta versión resumida sigue el orden del flujo:

| Paso del flujo | HU | Endpoints | Pantalla | Casos de prueba |
|---|---|---|---|---|
| Registrar, clasificar y priorizar | HU-01 | `POST /api/casos`, `GET /api/areas`, `GET /api/categorias?area_id=` | `/crear-caso` | CP-01, CP-02, CP-03, CP-11 |
| Consultar mis casos | HU-02 | `GET /api/casos?usuario_id=` | `/mis-solicitudes` | E1–E4 de HU-02 |
| Ver la bandeja | HU-03 | `GET /api/casos?bandeja=1` | `/bandeja-soporte` | CP-01, E1–E4 de HU-03 |
| Asignar | HU-04 | `PATCH /api/casos/:id/asignar` | `/bandeja-soporte` (Asignarme) | CP-06 |
| Cambiar el estado | HU-05 | `PATCH /api/casos/:id/estado` | `/bandeja-soporte` (controles por fila) | CP-04, CP-05, CP-14 |
| Atender | HU-06 | `POST` y `GET /api/casos/:id/atenciones` | `/bandeja-soporte` (Registrar atención) | CP-07, CP-12 |
| Validar y cerrar | HU-07 | `POST /api/casos/:id/validacion`, `GET /api/casos?estado=` | `/por-validar` | CP-08, CP-09, CP-13, CP-17, CP-18 |
| Historial | HU-08 | `GET /api/casos/:id/historial?usuario_id=` | Ver historial en `/mis-solicitudes`, `/bandeja-soporte` y `/por-validar` | CP-16, CP-18 |
| Filtrar | HU-09 | `GET /api/casos?estado=&tipo=&area_id=&categoria_id=&prioridad=` | `/casos` | CP-10 |
| Indicadores | HU-10 | `GET /api/indicadores` | `/indicadores` | E1–E3 de HU-10 |
| Categorías | HU-11 | `GET /api/categorias?todas=1`, `POST /api/categorias`, `PUT` y `PATCH /api/categorias/:id` | `/categorias` | CP-15 |
| Detalle y solución | HU-12 | `GET /api/casos/:id?usuario_id=` | `/mis-solicitudes/:id` | CP-16, CP-18 |

Las historias sin un CP obligatorio (HU-02, HU-03 y HU-10) se probaron con los escenarios de su ficha. Los resultados están en [`casos_de_prueba.md`](pruebas/casos_de_prueba.md).

## 7. Decisiones y cambios del backlog

### Decisiones que cambiaron los requisitos

El registro completo (D-01 a D-24) está en [`decisiones.md`](decisiones.md). Las que modificaron o precisaron lo que pedía el backlog inicial:

| Decisión | Fecha | Cambio |
|---|---|---|
| [D-02](decisiones.md) | 2026-10-05 | Autenticación simulada con selector de usuario de prueba. |
| [D-03](decisiones.md) | 2026-10-05 | Campo `historial.detalle`, agregado al modelo mínimo para guardar el motivo de devolución. |
| [D-08](decisiones.md) | 2026-10-08 | Refinamiento del Sprint 1: <ul><li>solo un `solicitante` registra casos y solo un `agente` cambia estados;</li><li>la bandeja muestra todo lo no cerrado;</li><li>el endpoint genérico no cierra ni devuelve;</li><li>catálogo de eventos en `snake_case` (reemplaza `CREADO`).</li></ul> |
| [D-14](decisiones.md) | 2026-10-10 | Decisión pendiente de HU-04 resuelta: asignarse un caso `Pendiente` lo pasa a `En análisis`. |
| [D-15](decisiones.md) | 2026-10-10 | Refinamiento del Sprint 2: <ul><li>evento `atencion`;</li><li>diagnóstico obligatorio y solución opcional;</li><li>devolver exige un motivo de 10 caracteres;</li><li>un caso ajeno responde `404`.</li></ul> |
| [D-20](decisiones.md) | 2026-10-12 | Refinamiento del Sprint 3: <ul><li>filtros con AND y `400` fuera del dominio;</li><li>indicadores en SQL sin librería de gráficos;</li><li>categorías sin borrado físico;</li><li>detalle como página propia.</li></ul> |

### Cambios de planificación

| Fecha | Cambio | Motivo | Registro |
|---|---|---|---|
| 2026-10-10 | El Sprint 1 terminó el 10 oct y no el 7. | Retraso de 3 días sobre el plan. | [Retro del Sprint 1](retrospectivas/sprint-1.md) |
| 2026-10-10 | El Sprint 2 se replanificó al 11 oct (antes 8–10 oct). | El Sprint 1 terminó el 10 oct. | [Sprint 2](sprints/sprint-2.md) |
| 2026-10-12 | El Sprint 3 se replanificó al 12 (noche) y 13 oct (antes 11–12 oct). | Retraso arrastrado del Sprint 2. | [Políticas](politicas.md) y [Sprint 3](sprints/sprint-3.md) |
| 2026-10-09 a 2026-10-13 | Entraron 3 defectos al backlog (DEF-01 a DEF-03). | Los encontró la QA. | Sección 3 |

En ningún sprint se quitó ni se reestimó una historia: las 12 se terminaron con los puntos del backlog inicial.

### Eventos de cambio del docente (E1–E5)

En el repositorio y en las issues **no hay registro** de que el docente (Product Owner) introdujera eventos de cambio E1–E5 durante el taller.

> Si el docente introduce alguno, se registra aquí con la fecha, el cambio pedido, el análisis de impacto y capacidad, y la decisión del equipo (regla 7 del tablero en [`politicas.md`](politicas.md): se crea el PBI, se prioriza y se analiza la capacidad antes de aceptarlo).

| Evento | Fecha | Cambio pedido | Impacto | Decisión |
|---|---|---|---|---|
| — | — | — | — | — |

No confundir con los escenarios de aceptación E1–E5 de cada ficha de historia: esos son criterios de aceptación, no cambios del backlog.
