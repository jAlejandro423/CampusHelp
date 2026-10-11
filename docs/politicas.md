# Políticas del equipo – CampusHelp

> Issue #2 · `[SETUP] Definir Product Goal, DoR, DoD y políticas del tablero`
> Estado: **Propuesta** — se vuelve vigente cuando los 3 integrantes la aprueben (sección final).

## 1. Producto

**Product Goal**
Entregar el 13 de octubre de 2026 un MVP web de CampusHelp que permita gestionar de extremo a extremo los incidentes y solicitudes de servicio tecnológico de la universidad:
**Registrar → Clasificar → Priorizar → Asignar → Atender → Validar → Cerrar**,
con persistencia en MySQL, historial completo e indicadores calculados sobre datos reales.

| Sprint | Fechas | Sprint Goal | Historias | Puntos |
|---|---|---|---|---|
| 0 – Preparación | 5 oct | Herramientas, BD, tablero y políticas listos para empezar a desarrollar. | — | — |
| 1 | 6–7 oct (real: 6–10 oct) | Un solicitante registra incidentes y solicitudes, y un agente los ve en su bandeja y cambia su estado. | HU-01, HU-02, HU-03, HU-05 | 16 |
| 2 | 11 oct (replanificado; antes 8–10 oct) | Completar el flujo Asignar → Atender → Validar → Cerrar con historial trazable. | HU-04, HU-06, HU-07, HU-08 | 18 |
| 3 | 12 oct (replanificado; antes 11–12 oct) | Filtros, indicadores, gestión de categorías, detalle del caso, QA completo y README ejecutable. | HU-09, HU-10, HU-11, HU-12 | 14 |
| Entrega | 13 oct | Verificación final, demo y defensa. | — | — |

> Los sprints duran menos de lo que sugiere el taller (1 semana) porque el plazo total es de 8 días. La cadencia y las ceremonias se conservan.

## 2. Roles

| Integrante | GitHub | Rol principal | También apoya |
|---|---|---|---|
| Alejandro | @jAlejandro423 | Scrum Master, QA y documentación | Desarrollo cuando el flujo lo necesite |
| — | @Jesusda11 | Desarrollo backend (Node/Express) y BD (MySQL) | Revisión de PR del frontend |
| — | @sukanico | Desarrollo frontend (React) | Revisión de PR del backend |

El **Product Owner** es el docente o cliente del taller: el backlog inicial y sus prioridades vienen de él. El equipo puede refinar, dividir y reestimar historias, pero los cambios de prioridad se justifican y se registran.

## 3. Cadencia y ceremonias

| Ceremonia | Cuándo | Duración | Evidencia (dónde queda) |
|---|---|---|---|
| Sprint Planning | Primer día de cada sprint | 30 min | Sprint Goal en el milestone y HU en **Ready** |
| Daily | Todos los días a las **[definir hora]** | 10–15 min | Comentario en la issue `[SCRUM] Ceremonias y evidencias del Sprint N` |
| Refinement | Al menos 1 por sprint (antes del Planning siguiente) | 30 min | Fichas en `docs/historias/` actualizadas |
| Sprint Review | Último día del sprint | 20 min | Capturas o video en `docs/evidencias/reviews/` |
| Retrospective | Después de la Review | 20 min | `docs/retrospectivas/sprint-N.md` con **una mejora acordada** |

**Formato de la Daily** (un comentario por día):
```
Daily – AAAA-MM-DD
WIP: Análisis X/3 · Atención X/3 · Validación X/2
@usuario: ayer … / hoy … / bloqueos …
Decisiones: …
```

## 4. Tablero ScrumBan

### 4.1 Qué va en el tablero
- La vista principal **"Flujo"** muestra solo las **historias de usuario** (label `historia`). Los límites WIP se cuentan sobre ellas.
- Las sub-issues técnicas (BACK/FRONT/QA) se ven en la vista **"Tareas"**, agrupadas por responsable. Una historia avanza cuando sus tareas lo permiten.
- Las issues de setup, ceremonias y documentación también pasan por el tablero, pero **no cuentan para el WIP** de historias.

### 4.2 Columnas, criterios de entrada y de salida

| Columna | WIP | Entra cuando… | Sale cuando… |
|---|---|---|---|
| **Product Backlog** | — | Existe la historia con actor y prioridad. | Se refina y cumple la DoR. |
| **Ready** | — | Cumple la **Definition of Ready**. | Alguien la toma en un Sprint Planning o porque hay capacidad (pull). |
| **En análisis** | **3** | El equipo la toma: diseño de datos, endpoints y pantallas; sub-issues creadas y asignadas. | El diseño está claro y existe la rama de la primera tarea. |
| **En atención** | **3** | Empieza el desarrollo (código en ramas por issue). | Todos los PR de sus tareas están abiertos y con pruebas del desarrollador. |
| **En validación** | **2** | Los PR están en revisión y QA ejecuta los casos de prueba. | Se cumple la **Definition of Done**. Si falla, **vuelve a En atención** con comentario del motivo. |
| **Done** | — | Cumple la DoD y los PR están fusionados en `develop`. | — |

### 4.3 Reglas de flujo
1. **Pull, no push:** nadie mete trabajo en una columna; quien tiene capacidad lo jala desde la columna anterior.
2. **WIP lleno = ayudar primero:** si una columna llegó a su límite, no se empieza nada nuevo. Primero se ayuda a terminar, probar, revisar un PR o desbloquear lo que ya está en curso.
3. **Validación con WIP 2:** si ya hay 2 historias en validación, el equipo prioriza revisar PR y ejecutar pruebas antes de seguir desarrollando.
4. **Bloqueos visibles:** se agrega la label `bloqueado` y un comentario con *motivo, fecha de inicio e impacto*. Al resolverse se quita la label y se comenta la fecha de fin. Los bloqueos se registran en la hoja de métricas.
5. **Expedite (máx. 1):** solo para un defecto crítico que impida demostrar el flujo principal. Se marca con `expedite` y en un comentario se justifica qué trabajo desplaza.
6. **Defectos:** se crean como issue con label `defecto` (ID, pasos, esperado, obtenido, prioridad) y se enlazan a la historia afectada.
7. **Nuevas funcionalidades** que pida el cliente: se crea el PBI en Product Backlog, se prioriza y se analiza la capacidad antes de aceptarlo en un sprint.
8. **Mover la tarjeta es responsabilidad de quien hace el trabajo**, en el momento en que ocurre (no al final del día).

## 5. Definition of Ready (DoR)

Una historia puede pasar a **Ready** cuando:
- [ ] Tiene **actor, necesidad y valor** (Como… quiero… para…).
- [ ] Tiene **descripción clara** y **prioridad** (P1, P2 o P3).
- [ ] Tiene sus **reglas de negocio** y excepciones escritas.
- [ ] Tiene **criterios de aceptación** verificables en formato Given/When/Then.
- [ ] Está **estimada** en Story Points (1, 2, 3, 5, 8 o 13).
- [ ] Sus **dependencias** son conocidas y no hay ninguna bloqueante sin plan.
- [ ] No quedan **preguntas críticas** pendientes.
- [ ] Tiene ficha en `docs/historias/HU-XX.md`.

Una historia de 13 puntos **no puede** entrar a Ready: se divide en historias más pequeñas que aporten valor.

## 6. Definition of Done (DoD)

Una historia está **Done** cuando:
- [ ] El código está **integrado en `develop`** mediante PR revisado y aprobado por otro integrante.
- [ ] Los **criterios de aceptación** se verificaron sobre la aplicación en ejecución.
- [ ] Los **casos de prueba** vinculados se ejecutaron y su resultado real quedó en `docs/pruebas/`.
- [ ] **No hay defectos críticos abiertos** asociados.
- [ ] Los datos se **persisten en MySQL** y se conservan al reiniciar la aplicación.
- [ ] La **documentación** está actualizada (ficha de la HU, endpoints, README si aplica).
- [ ] La funcionalidad es **demostrable** desde la interfaz, sin datos simulados.

## 7. Estimación

Escala de Story Points: **1, 2, 3, 5, 8, 13** (estimación relativa). Referencia del equipo:
- **3 pts:** una consulta con su pantalla (por ejemplo HU-02, Mis casos).
- **5 pts:** una operación con validaciones, transacción e historial (por ejemplo HU-01 o HU-05).

## 8. Registro de métricas

- La fecha real en que una historia **entra a cada columna** se anota en la hoja de seguimiento **el mismo día** (ver `docs/metricas/`).
- Se calculan por sprint: **WIP** (conteo en cada Daily), **Throughput** (historias Done), **Lead Time** (Done − Ready), **Cycle Time** (Done − En análisis), **defectos** y **bloqueos** (cantidad y duración).
- **No se inventan ni reconstruyen métricas al final.** Si se olvida un registro, se anota la fecha más probable y se deja la observación.
- El flujo del tablero se justifica con el **roadmap del Project** (vista Roadmap), donde cada issue queda en su fecha real de cierre. Ya no se toman capturas diarias del tablero (acordado en la [retrospectiva del Sprint 1](retrospectivas/sprint-1.md)).

## 9. Aprobación

| Integrante | Aprobado | Fecha |
|---|---|---|
| @jAlejandro423 | [ ] | |
| @Jesusda11 | [ ] | |
| @sukanico | [ ] | |

Cualquier cambio a estas políticas se acuerda en una retrospectiva y se registra aquí:

| Fecha | Cambio | Motivo (evidencia) |
|---|---|---|
| 2026-10-10 | Sección 8: la captura diaria del tablero se reemplaza por el roadmap del Project. | Retrospectiva del Sprint 1: las capturas diarias no se tomaron y el roadmap muestra la fecha real de cierre de cada issue ([sprint-1.md](retrospectivas/sprint-1.md)). |
| 2026-10-10 | Sección 1: el Sprint 2 pasa al 11 oct y el Sprint 3 al 12 oct. | El Sprint 1 terminó el 10 oct, 3 días tarde ([retrospectiva](retrospectivas/sprint-1.md)). Se decidió en el Sprint 2 Planning ([sprint-2.md](sprints/sprint-2.md)). |
