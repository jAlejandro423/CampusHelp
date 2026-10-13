# Retrospectiva – Sprint 3

> Issue #37. Las cifras salen de la pestaña **Resumen por sprint** de [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx).

## 1. Datos del sprint

| Campo | Valor |
|---|---|
| Sprint | 3 |
| Fechas | 2026-10-12 (noche) → 2026-10-13 (planeado: 2026-10-12 → 2026-10-13; en el cronograma original, 11–12 oct) |
| Fecha de la retro | 2026-10-13 |
| Facilitador | @jAlejandro423 |
| Asistentes | Por confirmar |
| Sprint Goal | El administrador filtra los casos, ve indicadores reales y gestiona las categorías, y el solicitante consulta el detalle y la solución de su caso. |
| ¿Se cumplió el Sprint Goal? | **Sí, en la fecha del Planning.** HU-09, 10, 11 y 12 están en Done y se demostraron con datos persistidos ([Review](../sprints/sprint-3.md)). Respecto al cronograma original (11–12 oct) el sprint terminó 1 día tarde, por el retraso que arrastraba del Sprint 2. |

## 2. Métricas

| Métrica | Valor | Comentario |
|---|---|---|
| HU comprometidas / terminadas | 4 / 4 | HU-09, HU-10, HU-11 y HU-12 |
| Puntos comprometidos / terminados (% cumplido) | 14 / 14 (100 %) | Además se cerró el DEF-02, que venía del Sprint 2. |
| Throughput (HU en Done) | 4 | |
| Lead Time promedio (días) | 0,47 (unas 11,4 h) | Desde la creación de las sub-issues en el Planning (2026-10-12, 22:24) hasta el cierre de la historia. Por historia: HU-09 0,44 · HU-10 0,44 · HU-11 0,51 · HU-12 0,51. |
| Cycle Time promedio (días) | 0,26 (unas 6,4 h) | Desde el primer commit BACK de la historia hasta el cierre de su issue. Por historia: HU-09 0,24 · HU-10 0,24 · HU-11 0,30 · HU-12 0,29. |
| WIP promedio (análisis · atención · validación) | — · — · — | No hubo dailies registradas. |
| Dailies con WIP excedido | — | No hubo dailies registradas. |
| Bloqueos (cantidad · días) | 0 · 0 | Ninguna issue tuvo la label `bloqueado`. |
| Defectos encontrados · abiertos | 1 · 0 | DEF-03 (#123, P3): el detalle del caso muestra "Caso no encontrado" ante un `500`. Se señaló como observación en la auditoría de la #107 y en la QA de la #108, y se registró como defecto al cerrar el sprint (ver [`casos_de_prueba.md`](../pruebas/casos_de_prueba.md)). No es crítico. Se corrigió con el PR #125 y se cerró el 2026-10-13. DEF-02 (#93) se corrigió con el PR #110 y se cerró el 2026-10-13, así que el Sprint 2 también queda con 0 defectos abiertos. |
| Devoluciones desde validación | 0 | |

Las fechas de cada columna no se anotaron durante el sprint: se tomaron de git y GitHub (ver la observación de la pestaña **Historias**). Los cuatro commits BACK (#97, #100, #103 y #106) se hicieron entre las 03:10 y las 03:39 (hora local) del 13 oct, así que el trabajo pudo empezar antes y el Cycle Time real puede ser algo mayor.

**Comparación con los sprints anteriores**

| Métrica | Sprint 1 | Sprint 2 | Sprint 3 |
|---|---|---|---|
| Puntos terminados | 16 / 16 | 18 / 18 | 14 / 14 |
| Días de retraso sobre el plan | 3 | 1 | 0 (1 sobre el cronograma original) |
| Cycle Time promedio (días) | 1,7 | 1,27 | 0,26 |
| Lead Time promedio (días) | — | 1,89 | 0,47 |
| Defectos encontrados · abiertos | 1 · 0 | 1 · 0 (DEF-02 cerrado en el Sprint 3) | 1 · 0 (DEF-03 cerrado con el PR #125) |
| PR con la espera más larga | #63: unas 17 h | #82: unas 9,5 h | #110: unas 8,3 h (abierto de noche, 04:04 → 12:23 UTC) |

El sprint duró una noche y una mañana, así que los tiempos son mucho más cortos que en los anteriores y no se comparan en igualdad de condiciones.

## 3. Revisión de la mejora anterior

**Mejora del Sprint 2:** toda revisión queda registrada en GitHub. Cada PR se fusiona solo después de una review **Approve** de otro integrante, y si la auditoría pide cambios, no se fusiona hasta corregirlos o registrar el defecto.

| Indicador | Meta | Resultado | Comentario |
|---|---|---|---|
| PR fusionados sin review Approve | 0 | **14 de 14** ❌ | Ninguno de los PR #109 a #122 tiene una review Approve. |
| PR de desarrollo con auditoría registrada | — | **9 de 9** ✅ | Los PR #110 a #118 tienen un comentario de auditoría "✅ Visto bueno" antes del merge, salvo el #118, cuyo comentario se publicó 3 minutos después del merge. |
| PR de QA y docs con revisión registrada | — | **0 de 5** ❌ | Los #109, #119, #120, #121 y #122 se fusionaron en 3 a 6 minutos sin review ni comentarios. |
| PR fusionados con "Cambios requeridos" sin defecto registrado | 0 | **0** ✅ | Ninguna auditoría pidió cambios. En las de la #98 y la #101 los arreglos se hicieron durante la propia auditoría (commits en el mismo PR). La observación no bloqueante del #118 se registró después como DEF-03 (#123). |
| PR fusionados por su propio autor | 0 | **0** ✅ | Se mantiene desde el Sprint 2. |

**Conclusión:** la mejora **no se cumplió** en lo que pedía. La revisión se hizo y quedó escrita en los PR de desarrollo, pero como comentario, no como review **Approve**. Los PR de QA y documentación siguen fusionándose sin ninguna revisión visible, igual que en el Sprint 2.

## 4. ¿Qué pasó?

| 👍 Qué funcionó | 👎 Qué no funcionó | 💡 Qué podemos probar |
|---|---|---|
| Las cuatro historias y el DEF-02 quedaron en Done en una sola jornada, en la fecha del Planning. | Ningún PR quedó con review **Approve**: la auditoría se publicó como comentario. | Publicar el veredicto de la auditoría directamente como review **Approve** o **Request changes**, no como comentario. |
| Las auditorías de los PR de desarrollo dejaron comentarios concretos y se resolvieron rápido (11 a 32 minutos para los PR de frontend). | Los PR de QA (#119 a #122) se fusionaron en 3 a 4 minutos, sin revisión. | Que quien fusiona un PR de QA deje al menos una review con lo que comprobó. |
| La tabla de dependencias y el orden de trabajo del Planning se cumplieron: BACK → FRONT → QA por historia. | Los títulos de los PR #117 y #118 no siguen la convención, y los commits de los #111 a #118 usan el alcance `casos` en vez de `filtros`, `indicadores` o `categorias`. | Revisar el título del PR y el alcance de los commits como parte de la auditoría (ya se señaló en las auditorías, pero no se corrigió antes del merge). |
| La QA de cada historia se ejecutó apenas se fusionaron su BACK y su FRONT, y solo encontró un defecto no crítico (DEF-03). | Otra vez no se registraron las dailies, las capturas del tablero ni las fechas de cada columna. | Anotar el estado del tablero en la issue de ceremonias al empezar cada jornada. |
| El DEF-02 del Sprint 2 se corrigió y se cerró. | El comentario de auditoría del #118 se publicó después del merge. | Publicar la auditoría y después fusionar, en ese orden. |

## 5. Incidentes del proceso

| Fecha | Qué ocurrió | Impacto | Causa raíz |
|---|---|---|---|
| 2026-10-13 | Los 14 PR del sprint se fusionaron sin review **Approve**. | No se cumple la mejora acordada en el Sprint 2. | Las auditorías se publicaron como comentario, y en los PR de QA no hubo revisión. |
| 2026-10-13 | Los PR #119, #120, #121 y #122 (QA de HU-09 a HU-12) se fusionaron en 3 a 4 minutos, sin review ni comentarios. | No queda evidencia de que alguien revisara la QA. | La prisa por llegar a la entrega. Se repite el incidente de los #89 y #91 del Sprint 2. |
| 2026-10-13 | El comentario de auditoría del PR #118 se publicó a las 13:40 UTC, después del merge (13:37 UTC). | La revisión existe, pero no precede al merge. | Se fusionó antes de terminar de publicar el veredicto. |
| 2026-10-13 | Los títulos de los PR #117 ("Feat/104 gestion categorias") y #118 ("Feat/107 detalle caso") no siguen Conventional Commits, y los commits de los #111 a #118 usan el alcance `casos`. | Trazabilidad por título y alcance menor, aunque todos llevan `Closes #N`. | GitHub propone el nombre de la rama como título. Las auditorías lo señalaron como observación no bloqueante. |
| 2026-10-13 | El PR #118 se fusionó con la observación de `DetalleMiCaso.tsx:36` sin corregir, y la QA de la #108 la confirmó. | La pantalla de detalle dice "Caso no encontrado" ante un `500`. Se registró como DEF-03 (#123) y se corrigió con el PR #125. | Las observaciones no bloqueantes de la auditoría no se convierten en defecto ni en tarea, así que nadie las retoma. |
| Todo el sprint | No se registraron dailies, capturas del tablero ni las fechas de entrada a cada columna. | No hay WIP diario. El Lead Time y el Cycle Time se calcularon con la fecha más probable. | Igual que en los sprints 1 y 2: no hay un responsable ni un momento fijo para registrarlas. |

## 6. Mejora acordada

**Propuesta** en la retro, **pendiente de que el equipo la confirme**. Como el Sprint 3 es el último, aplica a los PR que quedan hasta la entrega (#38 a #42) y a cualquier trabajo posterior.

| Campo | Valor |
|---|---|
| Mejora | **El veredicto de la auditoría es la review.** Quien audita un PR publica su veredicto como review **Approve** o **Request changes** en GitHub (no como comentario), y solo después se fusiona. Vale también para los PR de QA y documentación. |
| Problema que ataca | Los 14 PR del Sprint 3 sin review Approve, los 5 PR de QA y docs sin ninguna revisión y el comentario del #118 publicado después del merge. |
| Responsable | @jAlejandro423 |
| Cómo se medirá | En los PR restantes (#38 a #42): PR fusionados sin review Approve (meta: 0) y PR fusionados antes de su review (meta: 0). |
| Desde cuándo | 2026-10-13 |

## 7. Cambios a las políticas

- [x] No
- [ ] Sí

## 8. Evidencias

- Roadmap del tablero: https://github.com/users/jAlejandro423/projects/1/views/4
- Sprint Planning y Review: [`docs/sprints/sprint-3.md`](../sprints/sprint-3.md) y capturas en [`docs/evidencias/reviews/sprint-3/`](../evidencias/reviews/sprint-3/)
- Pruebas: [`docs/pruebas/casos_de_prueba.md`](../pruebas/casos_de_prueba.md)
- Métricas: [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx)
- Defecto cerrado: #93 (DEF-02), corregido con el PR #110
- Defecto cerrado: #123 (DEF-03), corregido con el PR #125
- Issue de ceremonias: #37
