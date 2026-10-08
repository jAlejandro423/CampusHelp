# Métricas ScrumBan

La hoja de seguimiento es [`seguimiento.xlsx`](seguimiento.xlsx). Se abre con Excel, LibreOffice o Google Sheets (*Archivo → Importar*). La pestaña **Léeme** explica cómo llenarla.

| Pestaña | Se llena | Para qué |
|---|---|---|
| Historias | Fecha y hora en que cada HU entra a Ready, En análisis, En atención, En validación y Done | Lead Time y Cycle Time por HU |
| WIP diario | Conteo por columna en cada Daily | WIP promedio y Dailies con WIP excedido (límites 3 / 3 / 2) |
| Bloqueos | Una fila por bloqueo (label `bloqueado`) | Cantidad y días bloqueados por sprint y por HU |
| Defectos | Una fila por defecto (label `defecto`) | Registro de defectos del taller y conteo por sprint |
| Resumen por sprint | Nada: se calcula solo | Throughput, puntos, promedios, bloqueos y defectos para la Review, la Retro y la #41 |

**Definiciones** (de [`docs/politicas.md` §8](../politicas.md)):
- **Lead Time:** Done − Ready.
- **Cycle Time:** Done − En análisis.
- **Throughput:** HU que llegan a Done dentro de las fechas del sprint.

**Reglas:**
- Las fechas se anotan **el mismo día** en que la tarjeta cambia de columna.
- No se reconstruyen al final. Si una se olvida, se anota la más probable y se explica en *Observaciones*.
- Para que los cambios no choquen entre ramas, solo el Scrum Master actualiza la hoja. Lo hace en la rama de la issue `[SCRUM] Ceremonias y evidencias del Sprint N`.
