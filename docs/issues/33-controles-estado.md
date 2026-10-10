# Issue #33 · [HU-05][FRONT] Controles de cambio de estado en cada fila

Rama: `feat/33-controles-estado-bandeja` (desde `feat/30-bandeja-agente`).
Ficha: `docs/historias/HU-05.md` (reglas 1-8, E1-E5). R2 HU-03: sin detalle en Sprint 1.

## Contrato BACK (services/estados.js, ya en develop)

`PATCH /api/casos/:id/estado { estado, usuario_id, detalle? }`
- Solo `agente` activo; solo avanzar un paso:
  `Pendiente→En análisis→En atención→En validación`.
- `Cerrada` y devolución reservadas a HU-07 → `409`; mismo estado → `409`;
  `Cerrada` no cambia → `409`; inexistente → `404`.
- Respuesta `200` con el caso; cambio + `historial(cambio_estado)` en transacción.

## Cambios FRONT

- `src/api/client.ts`: `TRANSICIONES` + `transicionesValidas(estado)` (solo para
  mostrar botones; decide el backend) y `cambiarEstadoCaso(id, estado, usuarioId)`
  que propaga `ApiError { error, detalles }`.
- `src/pages/BandejaSoporte.tsx`: columna `Acción` con un botón por transición
  válida (`Pasar a X`), aviso si el usuario no es agente, loading por fila,
  error por fila con el mensaje del backend + recarga de la bandeja tras cada
  cambio (refleja orden y estado real, E1). Sin acciones en `En validación`.
- Sin pantalla de detalle (R2): todo ocurre en la fila.

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `PATCH /1/estado {Cerrada, agente 3} → 409 Solo se llega a Cerrada por validación`
  y el front lo muestra en la fila sin cambiar nada (E2/CP-05).
- Pendiente muestra solo `Pasar a En análisis` (E5); tras avanzar, la bandeja
  se recarga con el nuevo estado e historial (E1/CP-04).
- Sin conflictos: solo `client.ts`, `BandejaSoporte.tsx` + este doc.

## Trazabilidad

- HU-05 E1-E5, CP-04 (avanza + historial), CP-05 (rechaza inválida).
- Desbloquea #34 (QA).
