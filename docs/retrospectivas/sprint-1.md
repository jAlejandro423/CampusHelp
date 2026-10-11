# Retrospectiva – Sprint 1

> Issue #35. Las cifras salen de la pestaña **Resumen por sprint** de [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx).

## 1. Datos del sprint

| Campo | Valor |
|---|---|
| Sprint | 1 |
| Fechas | 2026-10-06 → 2026-10-10 (planeado: 2026-10-06 → 2026-10-07) |
| Fecha de la retro | 2026-10-10 |
| Facilitador | @jAlejandro423 |
| Asistentes | @jAlejandro423 · @Jesusda11 · @sukanico |
| Sprint Goal | Un solicitante registra incidentes y solicitudes, y un agente los ve en su bandeja y cambia su estado. |
| ¿Se cumplió el Sprint Goal? | **Sí, con 3 días de retraso.** HU-01, 02, 03 y 05 están en Done y se demostraron con datos persistidos ([Review](../sprints/sprint-1.md)). El sprint estaba planeado hasta el 7 oct y la última historia se cerró el 10 oct. |

## 2. Métricas

| Métrica | Valor | Comentario |
|---|---|---|
| HU comprometidas / terminadas | 4 / 4 | HU-01, HU-02, HU-03 y HU-05 |
| Puntos comprometidos / terminados (% cumplido) | 16 / 16 (100 %) | Todo se terminó, pero fuera de las fechas del sprint. |
| Throughput (HU en Done) | 4 | |
| Lead Time promedio (días) | — | No se registró la entrada a Ready. |
| Cycle Time promedio (días) | 1,7 | Desde el primer commit de la historia hasta el cierre de su issue. Fechas tomadas de git y GitHub (ver la observación de la pestaña Historias). |
| WIP promedio (análisis · atención · validación) | — · — · — | No hubo dailies registradas. |
| Dailies con WIP excedido | — | No hubo dailies registradas. |
| Bloqueos (cantidad · días) | 0 · 0 | Ninguna issue tuvo la label `bloqueado`. |
| Defectos encontrados · abiertos | 1 · 0 | DEF-01 (#56): tildes corruptas al cargar `schema.sql` y `seeds.sql` en Windows. Se cerró el 9 oct. |
| Devoluciones desde validación | No aplica | La validación (HU-07) es del Sprint 2. |

**Comparación con el sprint anterior:** no aplica, es el primer sprint con historias.

## 3. Revisión de la mejora anterior

No aplica: es la primera retrospectiva.

## 4. ¿Qué pasó?

| 👍 Qué funcionó | 👎 Qué no funcionó | 💡 Qué podemos probar |
|---|---|---|
| El flujo Registrar → Bandeja → Cambiar estado funciona de punta a punta, con las reglas en el backend y el historial en transacción ([Review](../sprints/sprint-1.md)). | Terminamos 3 días después de lo planeado (último cierre: 10 oct), lo que comprime los Sprints 2 y 3. | Partir cada historia en PR pequeños y revisarlos el mismo día. |
| Cada historia tuvo QA con casos de prueba y evidencia ([`casos_de_prueba.md`](../pruebas/casos_de_prueba.md)). | Dos PR se fusionaron sin revisión: #49 (con el build roto) y #57 (fusionado por su propio autor). | Revisor fijo: @jAlejandro423 fusiona los PR de desarrollo y otro integrante los suyos. |
| El defecto DEF-01 (#56) se registró y se corrigió en menos de un día. | Varios PR quedaron esperando revisión muchas horas (#63: unas 17 h; #64: unas 10 h). | Revisar los PR abiertos al empezar y al terminar cada jornada. |
| Las auditorías de PR dejaron comentarios concretos antes de fusionar (por ejemplo #53 y #66). | No se registraron las dailies ni las fechas de cada columna, y las métricas se tuvieron que tomar de git y GitHub. | Justificar el flujo con el roadmap del Project y anotar las fechas en la hoja el mismo día. |

## 5. Incidentes del proceso

| Fecha | Qué ocurrió | Impacto | Causa raíz |
|---|---|---|---|
| 2026-10-07 | El PR #49 (scaffold de React, #8) se fusionó sin revisión y con el build roto. | Se reabrió la #8 y hubo que pedir un PR de corrección. | No había un responsable definido de revisar y fusionar. GitHub no lo impide porque el repo no tiene protección de ramas. |
| 2026-10-07 | El desarrollo de HU-01 empezó (primer commit del PR #54) antes de que se fusionara el refinamiento #10 (PR #53, 8 oct). | Se trabajó sin cumplir la Definition of Ready. | El sprint ya iba atrasado: terminaba ese mismo día. |
| 2026-10-09 | El PR #57 lo fusionó su propio autor, sin `Closes #N` y con una rama que no sigue las convenciones (`feature/HU-01-...`). | Su issue no se cerró sola y nadie lo revisó. | El acuerdo de revisión del 7 oct no se cumplió y GitHub no lo impide. |
| Todo el sprint | 9 PR no tenían `Closes #N` (#46, 47, 48, 49, 50, 51, 54, 55 y 57). | Las issues se cerraron a mano y la trazabilidad quedó incompleta. | La plantilla de PR no se usó siempre. |
| Todo el sprint | No se registraron dailies, capturas diarias del tablero ni las fechas de entrada a cada columna. | No hay WIP diario ni Lead Time. El Cycle Time se calculó con la fecha más probable. | No había un responsable ni un momento fijo para registrarlas. |
| Todo el sprint | Las columnas del tablero (Backlog, Ready, In progress, In review, Done) no coinciden con las de la política (En análisis, En atención, En validación). | El WIP por columna de la política no se puede leer en el tablero. | El Project se creó con las columnas por defecto. |

## 6. Mejora acordada

| Campo | Valor |
|---|---|
| Mejora | **Ningún PR se fusiona sin revisión.** @jAlejandro423 revisa y fusiona los PR de @Jesusda11 y @sukanico; los PR de @jAlejandro423 los aprueba otro integrante. Nadie fusiona su propio PR, y todo PR lleva `Closes #N`. |
| Problema que ataca | Los PR #49 y #57, fusionados sin revisión, y los 9 PR sin `Closes #N`. |
| Responsable | @jAlejandro423 |
| Cómo se medirá | En el Sprint 2: PR fusionados sin revisión (meta: 0), PR fusionados por su propio autor (meta: 0) y PR sin `Closes #N` (meta: 0). |
| Desde cuándo | 2026-10-10 |

**Compromiso adicional: mejorar los tiempos.** Se medirá con dos datos del Sprint 2: si las historias se cierran dentro de las fechas del sprint y cuánto tiempo pasa entre abrir y fusionar cada PR. Se revisa en la retrospectiva del Sprint 2.

## 7. Cambios a las políticas

- [ ] No
- [x] Sí: la captura diaria del tablero (sección 8 de [`politicas.md`](../politicas.md)) se reemplaza por el **roadmap del Project**, con las issues ubicadas en su fecha real de cierre. Las capturas de la Review se mantienen. El cambio se registró en la sección 9 de `politicas.md` en este mismo PR (#35).

## 8. Evidencias

- Roadmap del tablero: https://github.com/users/jAlejandro423/projects/1/views/4
- Sprint Review: [`docs/sprints/sprint-1.md`](../sprints/sprint-1.md) y capturas en [`docs/evidencias/reviews/sprint-1/`](../evidencias/reviews/sprint-1/)
- Pruebas: [`docs/pruebas/casos_de_prueba.md`](../pruebas/casos_de_prueba.md)
- Métricas: [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx)
- Issue de ceremonias: #35
