# Issue #30 · [HU-03][FRONT] Pantalla Bandeja del agente

Rama: `feat/30-bandeja-agente` (desde `feat/27-vista-mis-casos`).
Depende de #8 (lista) y #29 BACK (no cerrados ordenados por prioridad).
Ficha: `docs/historias/HU-03.md` (reglas 1-4, E1-E4, R2).

## Corrección tras revisión (bloqueantes)

1. **Orden + backend:** se usa `GET /api/casos?bandeja=1` (#29, ya en `develop`,
   integrado por merge). Excluye `Cerrada` y ordena `prioridad ASC, fecha ASC`
   (más antiguo primero dentro de cada prioridad). Se eliminó el filtro/orden
   en cliente y `ORDEN_PRIORIDAD`. Las reglas viven en el backend.
2. **Columnas completas (regla 2 HU-03):** ID, título, tipo, área/categoría,
   solicitante, prioridad (badge + borde rojo en P1), estado (badge),
   agente (`Sin asignar`) y fecha. La API ya trae todos esos campos.
3. **Sin detalle en Sprint 1 (R2):** eliminado `DetalleCaso.tsx`, la ruta
   `/casos/:id` y la columna `Ver`. El detalle llega con HU-12; los controles
   de HU-05 (#33) van en cada fila de la bandeja, y así queda el espacio libre.
4. **No bloqueantes aplicados:** vacío dice `No hay casos pendientes` (ficha HU-03);
   `colorEstado/colorPrioridad/formatearFecha` movidos a `src/components/badges.tsx`
   y reutilizados en `BandejaSoporte` y `MisSolicitudes`.

## Cambios finales

- `src/api/client.ts`: `obtenerBandeja() → getJson("/api/casos?bandeja=1")`.
- `src/components/badges.tsx` (nuevo): helpers compartidos.
- `src/pages/BandejaSoporte.tsx`: tabla completa sin columna detalle.
- `src/pages/MisSolicitudes.tsx`: importa helpers compartidos (sin duplicar).
- `src/App.tsx`: sin ruta `/casos/:id`; eliminado `DetalleCaso.tsx`.

## Verificación

- `npm run build` y `npm run lint` ok.
- Backend `GET /api/casos?bandeja=1 → 3, 1, 4, 2, 7` (P1 antiguos primero;
  #3 5-oct antes que #1 6-oct). Cerradas fuera, `Sin asignar` visible.
- API caída → banner de error; sin abiertos → `No hay casos pendientes`.
- Merge `origin/develop` (con #29) sin conflictos.

## Trazabilidad

- HU-03 E1-E4 (orden, excluye Cerrada, Pendiente/Sin asignar, antigüedad).
- Desbloquea #31 (QA) y #33 (controles por fila, sin pantalla de detalle).
