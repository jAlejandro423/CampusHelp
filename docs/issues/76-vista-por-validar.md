# Issue #76 · [HU-07][FRONT] Vista Por validar

Rama: `feat/76-vista-por-validar` (desde `feat/73-formulario-atencion`).
Ficha: `docs/historias/HU-07.md` (reglas 1-8, E1-E5).

## Contrato BACK (services/validacionService.js, ya en develop)

`POST /api/casos/:id/validacion { usuario_id, accion, motivo? } → 200`
- Solo validador activo; solo `En validación`; aprobar → `Cerrada` +
  `fecha_cierre` (evento `cierre`); devolver (motivo ≥10) → `En atención`
  conserva agente (evento `devolucion` con motivo).
- Listado: `GET /api/casos?estado=En validación` (E5, R3).

## Cambios FRONT

- `src/api/client.ts`: `obtenerPorValidar()` + `validarCaso()`.
- `src/pages/PorValidar.tsx` (era placeholder): tarjetas con título,
  categoría, agente, prioridad y **última solución** (`GET atenciones`,
  última con solución no vacía); **Aprobar** directo y **Devolver** con
  motivo inline (valida ≥10 en cliente y muestra el `400/409` del backend);
  recarga al terminar; botón **Ver historial** (cierra el pendiente de #79).
- Aviso si el usuario no es validador; aprobado sale de la lista (ya no es
  `En validación`), devuelto también (vuelve a `En atención`).

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `?estado=En validación → [4]` con agente y solución; motivo corto → `400`;
  validar un `Pendiente` → `409`; sin mutar en rechazados.
- Sin conflictos: `client.ts`, `PorValidar.tsx` + este doc.

## Trazabilidad

- HU-07 E1-E5, CP-08 (devolver), CP-09 (aprobar). Desbloquea #77 (QA).
