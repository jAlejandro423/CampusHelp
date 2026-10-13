# Issue #107 · [HU-12][FRONT] Pantalla de detalle del caso

Rama: `feat/107-detalle-caso` (desde `develop` con #106 fusionado).
Ficha: `docs/historias/HU-12.md` (reglas 1-4, E1-E3, R1: página enlazable).

## Contrato BACK (detalleService, ya en develop)

`GET /api/casos/:id?usuario_id= → 200` con fila HU-02 + `descripcion`,
fechas y `atenciones` cronológicas; historial aparte (R2). Ajeno para
solicitante → `404` (R3).

## Cambios FRONT

- `src/api/client.ts`: `DetalleCaso` + `obtenerDetalle()`.
- `src/components/HistorialTimeline.tsx`: extraído `HistorialContenido`
  (lista sin modal) reutilizado por el modal y el detalle (R2).
- `src/pages/DetalleMiCaso.tsx` (nueva) + ruta `/mis-solicitudes/:id`:
  datos con badges, descripción, solicitante/agente, fechas, atenciones
  (`Aún no hay atenciones registradas` si vacías, E3), historial inline y
  **Volver**.
- `src/pages/MisSolicitudes.tsx`: botón **Ver detalle** por fila.

## Verificación

- `npm run build` y `lint` ok (0 errores).
- Caso 5 propio → 200 con solución y agente (E1); caso 2 ajeno → 404 y
  `Caso no encontrado` (E2); caso 1 sin atenciones → mensaje E3.
- Sin conflictos: `client.ts`, `HistorialTimeline`, `DetalleMiCaso`,
  `App`, `MisSolicitudes` + este doc.

## Trazabilidad

- HU-12 E1-E3. Cierra el frente del MVP; desbloquea #108 (QA).
