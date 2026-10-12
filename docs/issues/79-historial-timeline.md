# Issue #79 · [HU-08][FRONT] Línea de tiempo del historial

Rama: `feat/79-linea-tiempo-historial` (base `develop` con #70 fusionado en #87).
Ficha: `docs/historias/HU-08.md` (reglas 1-5, E1-E4, R1: componente reutilizable).

## Contrato BACK (services/historialService.js, ya en develop)

`GET /api/casos/:id/historial?usuario_id=` → `200 [{ id, caso_id, evento, estado_anterior, estado_nuevo, usuario_id, usuario, fecha, detalle }]`
ordenado por fecha e id. Solicitante ajeno → `404` sin revelar (R2).

## Cambios FRONT

- `src/api/client.ts`: `HistorialEvento` + `obtenerHistorial(casoId, usuarioId)`.
- `src/components/HistorialTimeline.tsx` (nuevo, reutilizable): modal con línea
  de tiempo; texto legible por evento (`Devuelto: motivo…`), badges de
  anterior→nuevo, usuario, fecha y detalle. Estados cargando/error/vacío.
- `src/pages/MisSolicitudes.tsx` y `src/pages/BandejaSoporte.tsx`: botón
  `Ver historial` por fila que abre el modal (E4). En la bandeja se renderiza
  siempre, debajo de `Sin acciones` o de los botones. `Por validar` se cablea
  en #76 (HU-07 FRONT). El modal cierra con botón, clic en fondo o tecla Esc.
- HU-12 reutilizará este mismo componente en el detalle (R1).

## Verificación

- `npm run build` y `lint` ok (0 errores).
- Caso 5 (flujo completo): creación→asignación→envío→cierre en orden con
  usuario y fecha (E1). Devolución muestra motivo (E2, por diseño).
- Caso 1 pedido por solicitante 2 (ajeno) → `404`, el modal muestra error
  sin datos (E3).
- Sin conflictos: `client.ts`, `HistorialTimeline`, 2 páginas + este doc.

## Trazabilidad

- HU-08 E1-E4. Desbloquea #80 (QA flujo completo).
