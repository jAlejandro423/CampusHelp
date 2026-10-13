# DEF-03 #123 · El detalle muestra "Caso no encontrado" ante cualquier error

Rama: `fix/123-detalle-error-generico` (desde `develop`).
Historia: HU-12 (#22, pantalla de #107) · QA #108.

## Causa

`DetalleMiCaso` convertía todo error en "Caso no encontrado". Además,
`getJson` lanzaba `Error` genérico sin `status`, así que la pantalla no
podía distinguir el 404 de un 500 o un fallo de red.

## Corrección

- `src/api/client.ts`: `ApiError` movido arriba, helper `leerError` común y
  `getJson` que lanza `ApiError { status, detalles }` con el cuerpo del
  backend. Sin cambios para los demás listados (muestran sus mensajes).
- `src/pages/DetalleMiCaso.tsx`: 404 → "Caso no encontrado"; otro `4xx`
  → su mensaje; `5xx` o fallo de red → "No se pudo cargar el caso. Intenta
  de nuevo." (el `5xx` trae el mensaje interno de MySQL). Un id no numérico
  (`/mis-solicitudes/abc`) muestra "Caso no encontrado" sin llamar a la API.
- Se retiró de este PR la redirección al cambiar de rol (`MainLayout.tsx`):
  estaba fuera del alcance y sacaba del detalle a administrador, agente y
  validador, que pueden ver cualquier caso (regla 2 de HU-12).

## Verificación

- `npm run build` y `lint` ok (0 errores).
- Ajeno → 404 y "Caso no encontrado" (igual que antes); propio → 200.
- Sin conflictos: `client.ts`, `DetalleMiCaso.tsx` + este doc.

## Trazabilidad

- Cierra DEF-03 (#123, P3).
