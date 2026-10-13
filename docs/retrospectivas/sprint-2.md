# Retrospectiva – Sprint 2

> Issue #36. Las cifras salen de la pestaña **Resumen por sprint** de [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx).

## 1. Datos del sprint

| Campo | Valor |
|---|---|
| Sprint | 2 |
| Fechas | 2026-10-11 → 2026-10-12 (planeado: 2026-10-11) |
| Fecha de la retro | 2026-10-12 |
| Facilitador | @jAlejandro423 |
| Asistentes | Por confirmar |
| Sprint Goal | Completar el flujo Asignar → Atender → Validar → Cerrar con historial trazable. |
| ¿Se cumplió el Sprint Goal? | **Sí, con 1 día de retraso.** HU-04, 06, 07 y 08 están en Done y se demostraron con datos persistidos ([Review](../sprints/sprint-2.md)). El sprint estaba planeado para el 11 oct y las últimas historias (HU-07 y HU-08) se cerraron el 12 oct. |

## 2. Métricas

| Métrica | Valor | Comentario |
|---|---|---|
| HU comprometidas / terminadas | 4 / 4 | HU-04, HU-06, HU-07 y HU-08 |
| Puntos comprometidos / terminados (% cumplido) | 18 / 18 (100 %) | Se mantuvo el alcance: el riesgo de pasar HU-08 al Sprint 3 no ocurrió. |
| Throughput (HU en Done) | 4 | |
| Lead Time promedio (días) | 1,89 | Desde la creación de las sub-issues en el Planning (2026-10-10) hasta el cierre de la historia. Es la fecha más probable de entrada a Ready. |
| Cycle Time promedio (días) | 1,27 | Desde el primer commit BACK de la historia hasta el cierre de su issue. Por historia: HU-04 1,41 · HU-06 1,01 · HU-07 1,08 · HU-08 1,60. |
| WIP promedio (análisis · atención · validación) | — · — · — | No hubo dailies registradas. |
| Dailies con WIP excedido | — | No hubo dailies registradas. |
| Bloqueos (cantidad · días) | 0 · 0 | Ninguna issue tuvo la label `bloqueado`. |
| Defectos encontrados · abiertos | 1 · 1 | DEF-02 (#93, P3): la lista de **Por validar** desaparece después de un error de validación. Pasa al Sprint 3. |
| Devoluciones desde validación | 0 | Las devoluciones de la QA y de la demo fueron de prueba, no del proceso. |

Las fechas de cada columna no se anotaron durante el sprint: se tomaron de git y GitHub (ver la observación de la pestaña **Historias**).

**Comparación con el Sprint 1**

| Métrica | Sprint 1 | Sprint 2 |
|---|---|---|
| Puntos terminados | 16 / 16 | 18 / 18 |
| Días de retraso sobre el plan | 3 | 1 |
| Cycle Time promedio (días) | 1,7 | 1,27 |
| Lead Time promedio (días) | — | 1,89 |
| Defectos encontrados · abiertos | 1 · 0 | 1 · 1 |
| PR con la espera más larga | #63: unas 17 h | #82: unas 9,5 h |

## 3. Revisión de la mejora anterior

**Mejora del Sprint 1:** ningún PR se fusiona sin revisión, nadie fusiona su propio PR y todo PR lleva `Closes #N`.

| Indicador | Meta | Resultado | Comentario |
|---|---|---|---|
| PR fusionados por su propio autor | 0 | **0** ✅ | Los 14 PR del sprint los fusionó otro integrante. |
| PR de desarrollo o QA sin `Closes #N` | 0 | **0** ✅ | Los #81 y #83 no lo llevan a propósito: eran avances parciales de la #36, que debía seguir abierta. |
| PR fusionados sin revisión | 0 | **2** ⚠️ | Los 8 PR de desarrollo se auditaron con comentarios antes de fusionarse. Los #81, #83, #94 y #95 tienen aprobación formal. Los #89 y #91 (QA de HU-04 y HU-06) se fusionaron sin aprobación ni comentarios. |

**Compromiso de tiempos**

- Las historias se cerraron en 1 a 1,6 días desde su primer commit, frente a 1,7 días de promedio en el Sprint 1.
- La mayoría de los PR se fusionaron en menos de 2,5 horas. El más lento fue el #82, con unas 9,5 horas, frente a las 17 horas del #63 en el Sprint 1.
- El sprint terminó 1 día tarde, frente a 3 días en el Sprint 1.

**Conclusión:** la mejora funcionó en lo principal, porque nadie fusionó su propio PR y la trazabilidad con `Closes #N` quedó completa. Falta que todos los PR, también los de QA, queden con una aprobación visible en GitHub.

## 4. ¿Qué pasó?

| 👍 Qué funcionó | 👎 Qué no funcionó | 💡 Qué podemos probar |
|---|---|---|
| El flujo completo del MVP funciona de punta a punta desde la interfaz, con persistencia e historial ([Review](../sprints/sprint-2.md)). | El sprint terminó 1 día después de lo planeado, lo que deja un solo día para el Sprint 3. | Empezar el Sprint 3 por lo que necesita la demo y la defensa. |
| El orden de trabajo y la tabla de dependencias del Planning permitieron avanzar en paralelo (#69 y #78 a la vez). | El PR #92 se fusionó con el DEF-02 reportado y sin corregir. | No fusionar un PR con una auditoría en "Cambios requeridos" sin registrar antes el defecto y su prioridad. |
| Las auditorías dejaron comentarios concretos y los PR se fusionaron mucho más rápido que en el Sprint 1. | Los PR #89 y #91 se fusionaron sin aprobación ni comentarios. | Que la aprobación quede siempre como review (**Approve**) en GitHub, no solo como comentario. |
| Las fichas de las HU se refinaron antes de empezar el desarrollo y se cumplió la Definition of Ready. | Otra vez no se registraron las dailies ni las fechas de cada columna. | Anotar el estado del tablero en un comentario de la issue de ceremonias al empezar cada jornada. |
| La QA de cada historia encontró y registró el DEF-02 con pasos, causa y corrección propuesta. | Los títulos de los PR #88 y #95 no siguen la convención. | Revisar el título del PR como parte de la auditoría. |

## 5. Incidentes del proceso

| Fecha | Qué ocurrió | Impacto | Causa raíz |
|---|---|---|---|
| 2026-10-12 | Los PR #89 (#71) y #91 (#74) se fusionaron sin aprobación ni comentarios. | No queda evidencia de que alguien revisara la QA de HU-04 y HU-06. | La regla del Sprint 1 se cumplió en quién fusiona, pero no en dejar la revisión registrada. |
| 2026-10-12 | El PR #92 (#76, pantalla Por validar) se fusionó con el DEF-02 reportado en su segunda auditoría. | El defecto quedó abierto (#93, P3) y pasa al Sprint 3. | La prisa por cerrar el sprint, que ya iba atrasado. |
| 2026-10-12 | Los títulos de los PR #88 ("Feat/79 linea tiempo historial") y #95 ("Test/80 qa hu08 flujo mvp") no siguen Conventional Commits. | La trazabilidad por título es menor, aunque los dos llevan `Closes #N`. | GitHub propone el nombre de la rama como título y nadie lo cambió. |
| Todo el sprint | No se registraron dailies ni las fechas de entrada a cada columna. | No hay WIP diario. El Lead Time y el Cycle Time se calcularon con la fecha más probable. | Igual que en el Sprint 1: no hay un responsable ni un momento fijo para registrarlas. |

## 6. Mejora acordada

> **Propuesta, por confirmar con el equipo.**

| Campo | Valor |
|---|---|
| Mejora | **Toda revisión queda registrada en GitHub.** Cada PR se fusiona solo después de una review **Approve** de otro integrante. Si la auditoría pide cambios, no se fusiona hasta corregirlos o registrar el defecto con su prioridad. |
| Problema que ataca | Los PR #89 y #91, fusionados sin revisión, y el PR #92, fusionado con un defecto sin corregir. |
| Responsable | @jAlejandro423 |
| Cómo se medirá | En el Sprint 3: PR fusionados sin review Approve (meta: 0) y PR fusionados con "Cambios requeridos" sin un defecto registrado (meta: 0). |
| Desde cuándo | 2026-10-12 |

## 7. Cambios a las políticas

- [x] No
- [ ] Sí

## 8. Evidencias

- Roadmap del tablero: https://github.com/users/jAlejandro423/projects/1/views/4
- Sprint Review: [`docs/sprints/sprint-2.md`](../sprints/sprint-2.md) y capturas en [`docs/evidencias/reviews/sprint-2/`](../evidencias/reviews/sprint-2/)
- Pruebas: [`docs/pruebas/casos_de_prueba.md`](../pruebas/casos_de_prueba.md)
- Métricas: [`docs/metricas/seguimiento.xlsx`](../metricas/seguimiento.xlsx)
- Defecto abierto: #93 (DEF-02)
- Issue de ceremonias: #36
