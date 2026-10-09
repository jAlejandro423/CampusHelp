# Issue #30 · [HU-03][FRONT] Pantalla Bandeja del agente

Rama: `feat/30-bandeja-agente` (desde `feat/27-vista-mis-casos`).
Depende de #8 (lista) y #29 BACK (no cerrados ordenados por prioridad).

## Estado de la dependencia #29

`GET /api/casos` en esta rama solo ordena por fecha y no filtra Cerradas
(`casoService.listarCasos` solo acepta `usuario_id`). El BACK #29 no está
fusionado aquí, así que la bandeja filtra/ordena en cliente para desbloquear
el FRONT y QA #31 sin esperar al servidor.

## Cambios

- `src/api/client.ts`: `obtenerCasos()` + `obtenerBandeja()` (filtra
  `estado !== Cerrada`, ordena P1→P2→P3 y luego fecha DESC). Comentario deja
  claro que al llegar #29 se cambia al query de servidor sin tocar páginas.
- `src/pages/BandejaSoporte.tsx`: tabla ID, título, prioridad resaltada
  (badge + borde rojo lateral en P1), estado con badge por color, agente
  (`agente ?? Sin asignar`), fecha `es-CO`, enlace `Ver → /casos/:id`.
  Estados cargando / error / vacía.
- `src/pages/DetalleCaso.tsx` (nuevo) + ruta `/casos/:id` en `App.tsx`:
  busca el caso en `obtenerCasos()` y muestra tipo, área/categoría, prioridad,
  estado, agente y solicitante. Aclara que asignar/atender/validar llegan
  con HU-04/HU-05 (#33). Sin endpoint `GET /:id` no se inventa API.
- Reutiliza badges de `MisSolicitudes` para consistencia visual.

## Verificación

- `npm run build` y `npm run lint` ok.
- Backend local `GET /api/casos → 6 casos`; la bandeja muestra 4
  (excluye las 2 Cerradas), P1 primero, `Sin asignar` en id 1 y 2.
- `/casos/1` muestra el detalle; `/casos/999` muestra `Caso no encontrado`.
- Sin conflictos: solo toca `client.ts`, `App.tsx`, `BandejaSoporte.tsx`,
  `DetalleCaso.tsx` + este doc.

## Trazabilidad

- HU-03 (bandeja de pendientes para seleccionar trabajo).
- Desbloquea #31 (QA bandeja) y #33 (controles de estado en el detalle).
