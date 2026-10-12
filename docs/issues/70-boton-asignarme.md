# Issue #70 · [HU-04][FRONT] Botón Asignarme en bandeja

Rama: `feat/70-boton-asignarme` (desde `feat/33-controles-estado-bandeja`).
Ficha: `docs/historias/HU-04.md` (reglas 1-7, E1-E5, R3: solo en bandeja).

> El título menciona "detalle", pero R3 de HU-04 (igual que R2 de HU-03)
> dice que en el Sprint 1 no hay detalle: el botón va **solo en la bandeja**.

## Contrato BACK (services/estados.js, ya en develop)

`PATCH /api/casos/:id/asignar { usuario_id }`
- El agente se asigna a sí mismo: existe, activo, rol `agente`.
- Solo sin agente en `Pendiente`/`En análisis`; `Pendiente→En análisis`.
- `200` con el caso; `404`, `400`, `409` (ya asignado / estado no asignable);
  evento `asignacion` en transacción con `FOR UPDATE`.

## Cambios FRONT

- `src/api/client.ts`: `asignarCaso(id, usuarioId)` con `ApiError`.
- `src/pages/BandejaSoporte.tsx`: botón verde **Asignarme** visible solo si
  `agente_id === null` y estado `Pendiente`/`En análisis` (E5); loading
  `Asignando…`, error por fila con el mensaje del backend y recarga de la
  bandeja (muestra agente, nuevo estado y orden, E1/E3). Comparte `ocupado`
  con los botones de HU-05 para evitar doble envío.

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `PATCH /3/asignar {4} → 409 El caso ya tiene un agente asignado`
  (sin mutar; E2) y el front lo muestra en la fila.
- Casos con agente no muestran el botón; `En atención+` tampoco (E5/R4).
- Sin conflictos: solo `client.ts`, `BandejaSoporte.tsx` + este doc.

## Trazabilidad

- HU-04 E1-E5, CP-06. Desbloquea #71 (QA) y la regla 6 de HU-05
  (con agente, ya se puede pasar a `En atención`).
