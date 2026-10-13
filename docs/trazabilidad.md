# Matriz de trazabilidad – CampusHelp

Relaciona cada historia de usuario con sus reglas de negocio, endpoints, pantallas, casos de prueba e issues. Las 12 HU están refinadas (ver `docs/historias/`): las de los sprints 1 y 2 en sus Planning y las del Sprint 3 en su Planning del 2026-10-12.

## Matriz

| HU | Actor | Reglas de negocio | Endpoint | Pantalla | Casos de prueba | Issues | Estado del refinamiento |
|---|---|---|---|---|---|---|---|
| HU-01 Registrar incidente o solicitud | Solicitante | RN-01, RN-02, RN-03, RN-04, RN-10 | `POST /api/casos`, `GET /api/areas`, `GET /api/categorias?area_id=` | `/crear-caso` | CP-01, CP-02, CP-03, CP-11 | #11 · #23 #24 #25 | Refinada ([ficha](historias/HU-01.md)) |
| HU-02 Consultar mis casos | Solicitante | RN-05 | `GET /api/casos?usuario_id=` | `/mis-solicitudes` | E1–E4 de HU-02 (#28) | #12 · #26 #27 #28 | Refinada ([ficha](historias/HU-02.md)) |
| HU-03 Bandeja de casos pendientes | Agente | RN-06 | `GET /api/casos?bandeja=1` | `/bandeja-soporte` | CP-01 y E1–E4 de HU-03 (#31) | #13 · #29 #30 #31 | Refinada ([ficha](historias/HU-03.md)) |
| HU-05 Cambiar el estado | Agente | RN-07, RN-08, RN-09, RN-10 | `PATCH /api/casos/:id/estado` | `/bandeja-soporte` (controles por fila) | CP-04, CP-05, CP-14 y E3–E5 de HU-05 (#34) | #15 · #32 #33 #34 | Refinada ([ficha](historias/HU-05.md)) |
| HU-04 Asignarme un caso | Agente | RN-10, RN-11 | `PATCH /api/casos/:id/asignar` | `/bandeja-soporte` (botón Asignarme) | CP-06 y E2–E5 de HU-04 (#71) | #14 · #69 #70 #71 | Refinada ([ficha](historias/HU-04.md)) |
| HU-06 Registrar diagnóstico y solución | Agente asignado | RN-10, RN-12 | `POST` y `GET /api/casos/:id/atenciones` | `/bandeja-soporte` (Registrar atención) | CP-07, CP-12 y E2–E5 de HU-06 (#74) | #16 · #72 #73 #74 | Refinada ([ficha](historias/HU-06.md)) |
| HU-07 Aprobar o devolver | Validador | RN-08, RN-10, RN-13 | `POST /api/casos/:id/validacion`, `GET /api/casos?estado=` | `/por-validar` | CP-08, CP-09, CP-13, CP-17, CP-18 y E3–E5 de HU-07 (#77) | #17 · #75 #76 #77 | Refinada ([ficha](historias/HU-07.md)) |
| HU-08 Consultar historial | Solicitante, agente, validador, administrador | RN-05, RN-10 | `GET /api/casos/:id/historial?usuario_id=` | Ver historial en `/mis-solicitudes`, `/bandeja-soporte` y `/por-validar` | CP-16, CP-18, E1–E4 de HU-08 y flujo completo (#80) | #18 · #78 #79 #80 | Refinada ([ficha](historias/HU-08.md)) |
| HU-09 Filtrar casos | Administrador | RN-14 | `GET /api/casos?estado=&tipo=&area_id=&categoria_id=&prioridad=` | `/casos` | CP-10 y E2–E4 de HU-09 (#99) | #19 · #97 #98 #99 | Refinada ([ficha](historias/HU-09.md)) |
| HU-10 Indicadores | Administrador | RN-15 | `GET /api/indicadores` | `/indicadores` | E1–E3 de HU-10 (#102) | #20 · #100 #101 #102 | Refinada ([ficha](historias/HU-10.md)) |
| HU-11 Gestionar categorías | Administrador | RN-02, RN-16 | `GET /api/categorias?todas=1`, `POST /api/categorias`, `PUT` y `PATCH /api/categorias/:id` | `/categorias` | CP-15 y E1–E5 de HU-11 (#105) | #21 · #103 #104 #105 | Refinada ([ficha](historias/HU-11.md)) |
| HU-12 Detalle de mi caso y la solución | Solicitante | RN-05 | `GET /api/casos/:id?usuario_id=`, `GET /api/casos/:id/historial` | `/mis-solicitudes/:id` | CP-16, CP-18 y E1–E3 de HU-12 (#108) | #22 · #106 #107 #108 | Refinada ([ficha](historias/HU-12.md)) |

Los casos propios CP-11 a CP-18 (#38) están en la matriz y en la tabla de casos propios.

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
| RN-10 | Todo cambio de estado, asignación, atención o creación genera un registro en `historial` en la misma transacción. | Backend |
| RN-11 | Para pasar a `En atención`, el caso tiene agente asignado. | Backend (Sprint 2) |
| RN-12 | Solo el agente asignado registra la atención, y no se pasa a `En validación` sin una atención con solución. | Backend (Sprint 2) |
| RN-13 | Al cerrar se guarda `fecha_cierre`. Al devolver, el caso vuelve a `En atención` con el motivo en `historial.detalle`. | Backend (Sprint 2) |
| RN-14 | Los filtros del listado se combinan con AND y se aplican en el backend. Un valor fuera del dominio responde 400. | Backend, `GET /api/casos` (Sprint 3) |
| RN-15 | Los indicadores se calculan sobre los datos reales en cada consulta; los tiempos promedio van en horas. | Backend, `GET /api/indicadores` (Sprint 3) |
| RN-16 | Solo un administrador activo gestiona categorías. El nombre es único por área y las categorías se desactivan, no se borran. | Backend, `/api/categorias` (Sprint 3) |

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
| CP-10 | Filtrar por tipo, área y prioridad | HU-09 | RN-14 |

## Casos de prueba propios

| CP | Caso | HU | Regla |
|---|---|---|---|
| CP-11 | Categoría de otra área | HU-01 | RN-02 |
| CP-12 | Un agente no asignado registra una atención | HU-06 | RN-12 |
| CP-13 | Devolución sin motivo | HU-07 | RN-08 |
| CP-14 | Un caso cerrado no cambia | HU-05 | RN-09 |
| CP-15 | Una categoría desactivada no aparece en el registro | HU-11, HU-01 | RN-02, RN-16 |
| CP-16 | Un solicitante no ve un caso ajeno por URL | HU-12, HU-08 | RN-05 |
| CP-17 | Dos validaciones simultáneas del mismo caso | HU-07 | RN-08, RN-10 |
| CP-18 | Un caso devuelto muestra todas sus atenciones en orden | HU-12, HU-07, HU-08 | RN-10, RN-13 |

Los resultados reales de cada caso se registran en `docs/pruebas/`.
