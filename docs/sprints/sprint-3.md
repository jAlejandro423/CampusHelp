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
