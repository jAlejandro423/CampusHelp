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

### Orden de trabajo

Las historias dependen unas de otras: HU-04 → HU-06 → HU-07. HU-08 solo depende del historial, que ya existe.

1. **#69 y #78** primero, en paralelo: abren el camino al resto.
2. **#72** cuando se fusione #69, y **#75** cuando se fusione #72.
3. El frontend sigue al backend de cada historia (#70, #73, #76 y #79).
4. QA prueba cada historia apenas se fusionan su BACK y su FRONT. La #80 recorre el flujo completo al final.

### Riesgos

- **Capacidad:** el Sprint 1 completó 16 puntos en 5 días; este sprint compromete 18 puntos en 1 día. Si a mitad del día no se ha cerrado HU-04, se prioriza el flujo principal (HU-04, 06 y 07) y HU-08 pasa al Sprint 3.
- **DoR:** las fichas de HU-04, 06, 07 y 08 todavía no están refinadas en `docs/historias/`. El refinamiento debe hacerse antes de empezar el desarrollo, para no repetir el incidente del Sprint 1.

## Sprint Review

Pendiente.

## Retrospectiva

Pendiente: `docs/retrospectivas/sprint-2.md`.
