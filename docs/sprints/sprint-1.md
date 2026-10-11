# Sprint 1

> Issue #35 · Milestone "Sprint 1"

## Planning

| Campo | Valor |
|---|---|
| Fechas planeadas | 2026-10-06 → 2026-10-07 |
| Fechas reales | 2026-10-06 → 2026-10-10 |
| Sprint Goal | Un solicitante registra incidentes y solicitudes, y un agente los ve en su bandeja y cambia su estado. |
| Historias | HU-01 (#11), HU-02 (#12), HU-03 (#13) y HU-05 (#15) · 16 puntos |
| Refinamiento | #10 (PR #53): fichas en [`docs/historias/`](../historias/) y [matriz de trazabilidad](../trazabilidad.md) |

Cada historia se partió en tres sub-issues: BACK (@Jesusda11), FRONT (@sukanico) y QA (@jAlejandro423).

| HU | BACK | FRONT | QA | Cierre de la historia |
|---|---|---|---|---|
| HU-01 | #23 | #24 | #25 | 2026-10-09 |
| HU-02 | #26 | #27 | #28 | 2026-10-10 |
| HU-03 | #29 | #30 | #31 | 2026-10-10 |
| HU-05 | #32 | #33 | #34 | 2026-10-10 |

## Sprint Review (2026-10-10)

Demo del incremento sobre `develop` (`f5e0c41`), con una base MySQL limpia cargada con `db/schema.sql` y `db/seeds.sql`.

| # | Paso de la demo | HU | Resultado | Evidencia |
|---|---|---|---|---|
| 1 | Laura Gómez (solicitante) registra el incidente "Sin Wi-Fi en la biblioteca central": Red y conectividad / Wi-Fi, P1. | HU-01 | Se crea el caso #7 en `Pendiente`, con su evento de creación en el historial. | [01-hu01-registro.jpg](../evidencias/reviews/sprint-1/01-hu01-registro.jpg) |
| 2 | Laura abre **Mis Casos**. | HU-02 | Ve solo sus 4 casos, incluido el #7. | [02-hu02-mis-casos.jpg](../evidencias/reviews/sprint-1/02-hu02-mis-casos.jpg) |
| 3 | Diego Torres (agente) abre la **Bandeja**. | HU-03 | Los casos no cerrados aparecen por prioridad y antigüedad: el #7 queda con los P1, antes de los P2. | [03-hu03-bandeja.jpg](../evidencias/reviews/sprint-1/03-hu03-bandeja.jpg) |
| 4 | Diego pulsa **Pasar a En análisis** en el #7. | HU-05 | El caso queda `En análisis` y el historial suma `cambio_estado`, `Pendiente → En análisis`, `usuario_id = 3`. | [04-hu05-cambio-estado.jpg](../evidencias/reviews/sprint-1/04-hu05-cambio-estado.jpg) |
| 5 | Se detienen y se arrancan de nuevo MySQL y el backend, y se recarga la bandeja. | Persistencia | El #7 sigue `En análisis`. MySQL conserva 7 casos y 19 registros de historial. | [05-persistencia.jpg](../evidencias/reviews/sprint-1/05-persistencia.jpg) |

**Conclusión:** el Sprint Goal se cumplió. El incremento muestra el inicio del flujo principal (Registrar → Clasificar → Priorizar) y el cambio de estado con historial. Asignar, Atender, Validar y Cerrar son del Sprint 2.

Los resultados detallados de las pruebas están en [`docs/pruebas/casos_de_prueba.md`](../pruebas/casos_de_prueba.md).

## Retrospectiva

[`docs/retrospectivas/sprint-1.md`](../retrospectivas/sprint-1.md)

## Evidencia del tablero

Por acuerdo de la retrospectiva, el flujo se justifica con el [roadmap del Project](https://github.com/users/jAlejandro423/projects/1/views/4), donde cada issue cerrada está ubicada en su fecha real de cierre.
