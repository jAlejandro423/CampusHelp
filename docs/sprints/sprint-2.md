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

## Sprint Review (2026-10-12)

Demo del incremento sobre `develop` (`93f7b6f`), con una base MySQL limpia cargada con `db/schema.sql` y `db/seeds.sql` (6 casos, 4 atenciones y 21 registros de historial al inicio). Se usó el caso #1, "Sin acceso a Wi-Fi institucional en biblioteca" (Laura Gómez, P1, `Pendiente`).

| # | Paso de la demo | HU | Resultado | Evidencia |
|---|---|---|---|---|
| 1 | Diego Torres (agente) pulsa **Asignarme** en el #1 desde la bandeja. | HU-04 | El caso queda `En análisis`, con Diego como agente y `fecha_asignacion` 2026-10-12 21:37:46. | [01-hu04-asignar.jpg](../evidencias/reviews/sprint-2/01-hu04-asignar.jpg) |
| 2 | Diego lo pasa a `En atención` y registra la atención: "El punto de acceso de la biblioteca perdió la configuración del SSID institucional." / "Se restauró la configuración del punto de acceso y se reinició el equipo." Después lo pasa a `En validación`. | HU-06 | La atención queda guardada y el caso pasa a `En validación`. | [02-hu06-atencion.jpg](../evidencias/reviews/sprint-2/02-hu06-atencion.jpg) |
| 3 | Pedro Validador abre **Por validar** y devuelve el #1 con el motivo "El Wi-Fi volvió pero se cae cada pocos minutos; revisar la potencia del punto de acceso." | HU-07 | El caso vuelve a `En atención` con Diego, y el motivo queda en el historial. | [03-hu07-devolver.jpg](../evidencias/reviews/sprint-2/03-hu07-devolver.jpg) |
| 4 | Diego registra una segunda atención (subir la potencia y cambiar al canal 11) y lo envía de nuevo a validación. Pedro ve la nueva solución y **aprueba**. | HU-06, HU-07 | El caso queda `Cerrada`, con `fecha_cierre` 2026-10-12 21:39:15. | [04-hu07-aprobar.jpg](../evidencias/reviews/sprint-2/04-hu07-aprobar.jpg) |
| 5 | Se abre **Ver historial** del #1. | HU-08 | La línea de tiempo muestra 9 eventos en orden, con usuario y fecha: creación, asignación, cambio de estado, atención, envío a validación, devolución con su motivo, atención, envío a validación y cierre. | [05-hu08-historial.jpg](../evidencias/reviews/sprint-2/05-hu08-historial.jpg) |
| 6 | Se detienen y se arrancan de nuevo MySQL y el backend. Laura abre **Mis Solicitudes**. | Persistencia | El #1 sigue `Cerrada`. MySQL conserva 6 casos, 6 atenciones y 29 registros de historial, y el historial del #1 responde `200`. | [06-persistencia.jpg](../evidencias/reviews/sprint-2/06-persistencia.jpg) |

Durante la demo no hubo errores en la consola del navegador ni en el log de la API.

**Conclusión:** el Sprint Goal se cumplió, con un día de retraso. Con este incremento el flujo principal del MVP (**Registrar → Clasificar → Priorizar → Asignar → Atender → Validar → Cerrar**) funciona de punta a punta desde la interfaz, con persistencia en MySQL e historial trazable. Queda abierto el defecto DEF-02 (#93, prioridad baja), que pasa al Sprint 3.

Los resultados detallados de las pruebas (CP-06 a CP-09 y el flujo completo) están en [`docs/pruebas/casos_de_prueba.md`](../pruebas/casos_de_prueba.md).

## Retrospectiva

[`docs/retrospectivas/sprint-2.md`](../retrospectivas/sprint-2.md)

## Evidencia del tablero

Como en el Sprint 1, el flujo se justifica con el [roadmap del Project](https://github.com/users/jAlejandro423/projects/1/views/4), donde cada issue cerrada está ubicada en su fecha real de cierre.
