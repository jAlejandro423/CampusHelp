# Sprint 2

> Issue #36 · Milestone "Sprint 2 – Asignación, atención y validación"

## Planning (2026-10-10)

| Campo | Valor |
|---|---|
| Fechas planeadas | 2026-10-11 (originalmente 8–10 oct; se replanificó porque el Sprint 1 terminó el 10 oct) |
| Sprint Goal | Completar el flujo Asignar → Atender → Validar → Cerrar con historial trazable. |
| Historias | HU-04 (#14), HU-06 (#16), HU-07 (#17) y HU-08 (#18) · 18 puntos |
| Mejora en curso | Ningún PR se fusiona sin revisión ni sin `Closes #N` ([retro del Sprint 1](../retrospectivas/sprint-1.md)). |

| HU | Puntos | BACK (@Jesusda11) | FRONT (@sukanico) | QA (@jAlejandro423) |
|---|---|---|---|---|
| HU-04 Asignarme un caso | 3 | #69 | #70 | #71 (CP-06) |
| HU-06 Registrar diagnóstico y solución | 5 | #72 | #73 | #74 (CP-07) |
| HU-07 Aprobar o devolver una solución | 5 | #75 | #76 | #77 (CP-08, CP-09) |
| HU-08 Consultar historial | 5 | #78 | #79 | #80 (flujo completo del MVP) |

### Decisiones

- **Fechas:** el Sprint 2 dura un día (11 oct) y el Sprint 3 otro (12 oct). Se conservan los dos sprints y sus ceremonias para poder comparar métricas en la #41.
- **HU-04:** asignarse un caso `Pendiente` lo pasa a `En análisis`, con un solo evento `asignacion` en el historial ([D-14](../decisiones.md)). Con esto se corrigen también los eventos de los casos 4, 5 y 6 en `seeds.sql` (#69).

### Dependencias entre sub-issues

Cada sub-issue tiene en su descripción el bloque **🔗 Dependencias** con lo que la bloquea y lo que desbloquea.

| Sub-issue | Depende de | Desbloquea |
|---|---|---|
| #69 BACK asignar | #32 (✅) | #70, #71, #72 |
| #70 FRONT Asignarme | #69 | #71, #73 |
| #71 QA HU-04 | #69, #70 | #80 |
| #72 BACK atenciones | #69 | #73, #74, #75 |
| #73 FRONT atención | #72, #70 | #74, #76 |
| #74 QA HU-06 | #72, #73 | #80 |
| #75 BACK validación | #72 | #76, #77 |
| #76 FRONT Por validar | #75, #73 | #77 |
| #77 QA HU-07 | #75, #76 | #80 |
| #78 BACK historial | — | #79, #80 |
| #79 FRONT línea de tiempo | #78 | #80 |
| #80 QA flujo completo | #71, #74, #77, #79 | #42 |

### Orden de trabajo

Las historias dependen unas de otras: HU-04 → HU-06 → HU-07. HU-08 solo depende del historial, que ya existe.

1. **#69 y #78** primero, en paralelo: abren el camino al resto.
2. **#72** cuando se fusione #69, y **#75** cuando se fusione #72.
3. El frontend sigue al backend de cada historia (#70, #73, #76 y #79).
4. QA prueba cada historia apenas se fusionan su BACK y su FRONT. La #80 recorre el flujo completo al final.

### Riesgos

- **Capacidad:** el Sprint 1 completó 16 puntos en 5 días; este sprint compromete 18 puntos en 1 día. Si a mitad del día no se ha cerrado HU-04, se prioriza el flujo principal (HU-04, 06 y 07) y HU-08 pasa al Sprint 3.
- **DoR:** las fichas de HU-04, 06, 07 y 08 se refinaron el 2026-10-10 en `docs/historias/` ([D-15](../decisiones.md)), antes de empezar el desarrollo. El 2026-10-11 el equipo confirmó las dos propuestas que quedaban: la solución opcional en HU-06 (R1) y el `404` para el historial ajeno en HU-08 (R2).

## Sprint Review

Pendiente.

## Retrospectiva

Pendiente: `docs/retrospectivas/sprint-2.md`.
