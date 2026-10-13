# DEF-02 #93 · La lista de Por validar desaparece tras un error

Rama: `fix/93-lista-por-validar-error` (desde `develop`).
Historia: HU-07 (#17, pantalla de #76) · detectado en QA #77.

## Causa

`handleValidar` guardaba el error de la acción en `error`, y el render
(`cargando ? … : error ? recuadro : lista`) reemplazaba toda la lista por
el mensaje. Los demás casos quedaban ocultos hasta F5.

## Corrección

- Nuevo estado `aviso` para el error de la acción: se muestra encima de la
  lista y en la fila, sin reemplazarla; se limpia al intentar de nuevo y al
  salir bien. `error` queda solo para cuando falla la carga de la lista.
- Sin cambios de API ni de reglas: el backend ya cumplía (409 sin mutar).

## Verificación

- `npm run build` y `lint` ok (0 errores).
- Reproducción de la issue: con dos casos En validación, cerrar uno por otra
  vía y aprobarlo → 409 en `aviso` + fila, el otro caso sigue visible.
- Sin conflictos: solo `PorValidar.tsx` + este doc.

## Trazabilidad

- Cierra DEF-02 (#93, P3). Actualiza la evidencia de #77 si aplica.
