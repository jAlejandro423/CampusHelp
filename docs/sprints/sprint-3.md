# Sprint 3

> Issue #37 · Milestone "Sprint 3 – Filtros, indicadores y categorías"

## Planning (2026-10-12)

| Campo | Valor |
|---|---|
| Fechas planeadas | 2026-10-12 (noche) → 2026-10-13, antes de la entrega (originalmente 11–12 oct; se corrió porque el Sprint 2 terminó el 12 oct) |
| Sprint Goal | El administrador filtra los casos, ve indicadores reales y gestiona las categorías, y el solicitante consulta el detalle y la solución de su caso. |
| Historias | HU-09 (#19), HU-10 (#20), HU-11 (#21) y HU-12 (#22) · 14 puntos, todas comprometidas |
| Defecto incluido | DEF-02 (#93, P3) |
| Mejora en curso | Cada PR se fusiona solo después de una review **Approve** de otro integrante en GitHub. Si la auditoría pide cambios, no se fusiona hasta corregirlos o registrar el defecto ([retro del Sprint 2](../retrospectivas/sprint-2.md)). |

| HU | Puntos | BACK (@Jesusda11) | FRONT (@sukanico) | QA (@jAlejandro423) |
|---|---|---|---|---|
| HU-09 Filtrar casos | 3 | #97 | #98 | #99 (CP-10) |
| HU-10 Indicadores | 5 | #100 | #101 | #102 |
| HU-11 Gestionar categorías | 3 | #103 | #104 | #105 |
| HU-12 Detalle de mi caso | 3 | #106 | #107 | #108 |

Issues transversales del sprint: #37 (ceremonias), #38 (casos de prueba propios y registro de defectos), #39 (README), #40 (requisitos y trazabilidad), #41 (métricas) y #42 (entrega).

### Decisiones

- **Alcance:** el equipo compromete las 4 historias, sin orden de recorte.
- **Refinamiento:** las fichas de HU-09, 10, 11 y 12 se refinaron en esta Planning, en `docs/historias/`. Las decisiones R de cada ficha están resumidas en [D-20](../decisiones.md).

### Dependencias entre sub-issues

Cada sub-issue tiene en su descripción el bloque **🔗 Dependencias** con lo que la bloquea y lo que desbloquea. Las cuatro historias son independientes entre sí.

| Sub-issue | Depende de | Desbloquea |
|---|---|---|
| #97 BACK filtros | — | #98, #99 |
| #98 FRONT Casos con filtros | #97 | #99 |
| #99 QA HU-09 | #97, #98 | #38, #42 |
| #100 BACK indicadores | — | #101, #102 |
| #101 FRONT dashboard | #100 | #102 |
| #102 QA HU-10 | #100, #101 | #38, #42 |
| #103 BACK categorías | — | #104, #105 |
| #104 FRONT gestión de categorías | #103 | #105 |
| #105 QA HU-11 | #103, #104 | #38, #42 |
| #106 BACK detalle | — | #107, #108 |
| #107 FRONT detalle | #106 | #108 |
| #108 QA HU-12 | #106, #107 | #38, #42 |

### Orden de trabajo

1. **Backend** en el orden HU-09 (#97) → HU-11 (#103) → HU-10 (#100) → HU-12 (#106): primero lo más corto y de mayor prioridad.
2. El **frontend** sigue al backend de cada historia. DEF-02 (#93) entra cuando haya un hueco entre pantallas.
3. **QA** prueba cada historia apenas se fusionan su BACK y su FRONT. Al final, la #42 recorre el flujo completo y la demo.

### Riesgos

- **Tiempo:** el sprint dura una noche y la mañana de la entrega. Ningún PR puede quedar esperando revisión: se revisa apenas se abre.
- **Capacidad:** el Sprint 2 completó 18 puntos en 2 días (plan: 1). Este compromete 14 puntos más la documentación final (#38–#41).
- **Entrega:** si algo no queda listo, se entrega lo que esté en `develop` y funcione, sin pantallas a medias.

## Sprint Review (2026-10-13)

Demo del incremento sobre `develop` (`e740252`), con una base MySQL limpia cargada con `db/schema.sql` y `db/seeds.sql` (6 casos, 4 atenciones, 21 registros de historial y 16 categorías al inicio).

| # | Paso de la demo | HU | Resultado | Evidencia |
|---|---|---|---|---|
| 1 | Ana Admin abre **Casos** y filtra por tipo `Incidente`, prioridad `P1` y área `Red y conectividad` (CP-10). | HU-09 | Solo aparece el #1, "Sin acceso a Wi-Fi institucional en biblioteca". Es el único caso de la BD que cumple los tres filtros. | [01-hu09-filtros.jpg](../evidencias/reviews/sprint-3/01-hu09-filtros.jpg) |
| 2 | Ana abre **Indicadores**. | HU-10 | 6 casos, 7.1 h de creación a asignación (sobre 4 casos), 41.0 h de creación a cierre (sobre 2 casos) y los conteos por estado, tipo, prioridad y área, iguales a los de la BD. | [02-hu10-indicadores.jpg](../evidencias/reviews/sprint-3/02-hu10-indicadores.jpg) |
| 3 | Ana abre **Categorías** y crea "VPN" en `Red y conectividad`. | HU-11 | VPN aparece en la lista como `Activa` (id 17). | [03-hu11-crear-categoria.jpg](../evidencias/reviews/sprint-3/03-hu11-crear-categoria.jpg) |
| 4 | Laura Gómez abre **Crear Caso**, elige `Red y conectividad` y registra el incidente "No conecta la VPN desde casa" con la categoría VPN. | HU-11, HU-01 | VPN aparece en el registro y se crea el caso #7 en `Pendiente`, con la categoría VPN. | [04-hu11-registro-vpn.jpg](../evidencias/reviews/sprint-3/04-hu11-registro-vpn.jpg) |
| 5 | Laura abre el detalle de su caso #5 desde **Mis Solicitudes**. | HU-12 | Se ven los datos del caso, el agente, las tres fechas, la atención con diagnóstico y solución, y el historial completo. | [05-hu12-detalle.jpg](../evidencias/reviews/sprint-3/05-hu12-detalle.jpg) |
| 6 | Se detienen y se arrancan de nuevo MySQL y el backend. Ana filtra los casos por `Red y conectividad` y `VPN`. | Persistencia | Aparece el #7 con la categoría VPN. MySQL conserva 7 casos, 4 atenciones, 22 registros de historial y 17 categorías. | [06-persistencia.jpg](../evidencias/reviews/sprint-3/06-persistencia.jpg) |

Durante la demo no hubo errores en la consola del navegador ni en el log de la API.

DEF-02 (#93) se corrigió con el PR #110 y se cerró el 2026-10-13.

**Conclusión:** el Sprint Goal se cumplió. Las cuatro historias (14 puntos) quedaron en Done el 2026-10-13, la fecha del plan del Planning, y el defecto que venía del Sprint 2 quedó cerrado. Queda abierto un defecto de interfaz no crítico, DEF-03 (#123), para corregir antes de la entrega. Con este incremento están todas las historias del backlog (HU-01 a HU-12).

Los resultados detallados de las pruebas (CP-10 y los escenarios de HU-09 a HU-12) están en [`docs/pruebas/casos_de_prueba.md`](../pruebas/casos_de_prueba.md).

## Retrospectiva

[`docs/retrospectivas/sprint-3.md`](../retrospectivas/sprint-3.md)

## Evidencia del tablero

Como en los sprints anteriores, el flujo se justifica con el [roadmap del Project](https://github.com/users/jAlejandro423/projects/1/views/4), donde cada issue cerrada está ubicada en su fecha real de cierre.
