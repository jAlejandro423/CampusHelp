# Matriz de trazabilidad – CampusHelp

Relaciona cada historia de usuario con sus reglas de negocio, endpoints, pantallas, casos de prueba e issues. Las HU del Sprint 1 están refinadas (ver `docs/historias/`). Las de los sprints 2 y 3 se completan en su Sprint Planning; mientras tanto aparecen como *por refinar* y muestran lo que ya se sabe del taller.

## Matriz

| HU | Actor | Reglas de negocio | Endpoint | Pantalla | Casos de prueba | Issues | Estado del refinamiento |
|---|---|---|---|---|---|---|---|
| HU-01 Registrar incidente o solicitud | Solicitante | RN-01, RN-02, RN-03, RN-04, RN-10 | `POST /api/casos`, `GET /api/areas`, `GET /api/categorias?area_id=` | `/crear-caso` | CP-01, CP-02, CP-03 | #11 · #23 #24 #25 | Refinada ([ficha](historias/HU-01.md)) |
| HU-02 Consultar mis casos | Solicitante | RN-05 | `GET /api/casos?usuario_id=` | `/mis-solicitudes` | E1–E4 de HU-02 (#28) | #12 · #26 #27 #28 | Refinada ([ficha](historias/HU-02.md)) |
| HU-03 Bandeja de casos pendientes | Agente | RN-06 | `GET /api/casos?bandeja=1` | `/bandeja-soporte` | CP-01 y los de #31 | #13 · #29 #30 #31 | Refinada ([ficha](historias/HU-03.md)) |
| HU-05 Cambiar el estado | Agente | RN-07, RN-08, RN-09, RN-10 | `PATCH /api/casos/:id/estado` | `/bandeja-soporte` (controles por fila) | CP-04, CP-05 | #15 · #32 #33 #34 | Refinada ([ficha](historias/HU-05.md)) |
| HU-04 Asignarme un caso | Agente | RN-10, RN-11 | `PATCH /api/casos/:id/asignar` | `/bandeja-soporte` | CP-06 | #14 | Por refinar (Sprint 2) |
| HU-06 Registrar diagnóstico y solución | Agente asignado | RN-10, RN-12 | `POST /api/casos/:id/atenciones` | Por definir | CP-07 | #16 | Por refinar (Sprint 2) |
| HU-07 Aprobar o devolver | Validador | RN-08, RN-10, RN-13 | `POST /api/casos/:id/validacion` | `/por-validar` | CP-08, CP-09 | #17 | Por refinar (Sprint 2) |
| HU-08 Consultar historial | Solicitante, agente, validador, administrador | RN-10 | `GET /api/casos/:id/historial` | Por definir | Por definir | #18 | Por refinar (Sprint 2) |
| HU-09 Filtrar casos | Administrador | — | `GET /api/casos?estado=&tipo=&area_id=&categoria_id=&prioridad=` | `/casos` | CP-10 | #19 | Por refinar (Sprint 3) |
| HU-10 Indicadores | Administrador | — | `GET /api/indicadores` | `/indicadores` | Por definir | #20 | Por refinar (Sprint 3) |
| HU-11 Gestionar categorías | Administrador | RN-02 | `POST`, `PUT /api/categorias` y `PATCH /api/categorias/:id` | `/categorias` | Por definir | #21 | Por refinar (Sprint 3) |
| HU-12 Detalle de mi caso y la solución | Solicitante | RN-05 | `GET /api/casos/:id` | Por definir | Por definir | #22 | Por refinar (Sprint 3) |

Los casos propios (CP-11 en adelante) se agregan a esta matriz cuando se escriban en la #38.

## Reglas de negocio

| ID | Regla | Dónde se aplica |
|---|---|---|
| RN-01 | Tipo, área, categoría, título y prioridad son obligatorios. La descripción tiene al menos 10 caracteres. | Backend, `POST /api/casos` |
| RN-02 | La categoría pertenece al área elegida, y las dos están activas. | Backend, `POST /api/casos` |
| RN-03 | La fecha de creación es automática y el estado inicial es `Pendiente`. | Backend y base de datos |
| RN-04 | Solo registra casos un usuario activo con rol `solicitante`. | Backend |
| RN-05 | El solicitante solo ve sus propios casos. | Backend (filtro por `usuario_id`) |
| RN-06 | La bandeja muestra los casos no cerrados, ordenados por prioridad y luego por antigüedad. | Backend (`bandeja=1`) |
| RN-07 | Solo se permiten las transiciones del mapa de estados. Las demás devuelven 409. | Backend, `services/estados.js` |
| RN-08 | Solo se llega a `Cerrada` por la validación (HU-07). La devolución también es exclusiva de la validación y exige motivo. | Backend |
| RN-09 | Un caso `Cerrada` no cambia. | Backend |
| RN-10 | Todo cambio de estado, asignación o creación genera un registro en `historial` en la misma transacción. | Backend |
| RN-11 | Para pasar a `En atención`, el caso tiene agente asignado. | Backend (Sprint 2) |
| RN-12 | Solo el agente asignado registra la atención, y no se pasa a `En validación` sin una atención con solución. | Backend (Sprint 2) |
| RN-13 | Al cerrar se guarda `fecha_cierre`. Al devolver, el caso vuelve a `En atención` con el motivo en `historial.detalle`. | Backend (Sprint 2) |

## Casos de prueba obligatorios

| CP | Caso | HU | Regla |
|---|---|---|---|
| CP-01 | Registrar incidente válido | HU-01, HU-03 | RN-01, RN-03 |
| CP-02 | Registrar sin descripción | HU-01 | RN-01 |
| CP-03 | Registrar solicitud de servicio | HU-01 | RN-01 |
| CP-04 | Cambio de estado válido | HU-05 | RN-07, RN-10 |
| CP-05 | Transición inválida | HU-05 | RN-07, RN-08 |
| CP-06 | Asignar agente | HU-04 | RN-10, RN-11 |
| CP-07 | Registrar diagnóstico y solución | HU-06 | RN-12 |
| CP-08 | Devolver desde validación | HU-07 | RN-08, RN-13 |
| CP-09 | Cerrar caso aprobado | HU-07 | RN-08, RN-13 |
| CP-10 | Filtrar por tipo, área y prioridad | HU-09 | — |

Los resultados reales de cada caso se registran en `docs/pruebas/`.
