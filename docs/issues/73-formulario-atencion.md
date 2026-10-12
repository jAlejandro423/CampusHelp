# Issue #73 · [HU-06][FRONT] Formulario de diagnóstico y solución

Rama: `feat/73-formulario-atencion` (desde `feat/79-linea-tiempo-historial`).
Ficha: `docs/historias/HU-06.md` (reglas 1-7, E1-E5, R5: en la bandeja).

## Contrato BACK (services/atencionService.js, ya en develop)

`POST /api/casos/:id/atenciones { usuario_id, diagnostico, solucion? } → 201`
- Solo agente asignado, solo `En atención`; diagnóstico ≥10, solución opcional
  (si va, ≥10); no cambia estado; evento `atencion` en transacción.
- `GET /api/casos/:id/atenciones?usuario_id= → 200` cronológico con agente.

## Cambios FRONT

- `src/api/client.ts`: `Atencion`, `obtenerAtenciones()`, `registrarAtencion()`.
- `src/components/AtencionForm.tsx` (nuevo modal): lista de atenciones previas,
  diagnóstico con contador (bloquea <10), solución opcional (vacía o ≥10),
  error del backend con detalles, cierre con botón/fondo/Esc. No cambia estado;
  al guardar recarga la bandeja.
- `src/pages/BandejaSoporte.tsx`: botón morado **Registrar atención** solo en
  filas `En atención` del agente actual; `Sin acciones` lo tiene en cuenta.

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `POST` con diagnóstico corto → `400 Diagnóstico mínimo…` sin mutar (E3).
- `GET /3/atenciones → 1 previa` con agente y fecha (lista del modal).
- Sin conflictos: `client.ts`, `AtencionForm`, `BandejaSoporte` + este doc.

## Trazabilidad

- HU-06 E1-E3/E5, CP-07. Desbloquea #74 (QA) y el paso a validación con
  solución (regla 6 de HU-06 / HU-05).
