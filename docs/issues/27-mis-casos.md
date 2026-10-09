# Issue #27 · [HU-02][FRONT] Vista Mis casos

Rama: `feat/27-vista-mis-casos` (desde `feature/HU-01-formulario-registro`, incluye #24).
Backend: `GET /api/casos?usuario_id=` (#26).

## Contrato usado

`GET /api/casos?usuario_id=1 → 200 [{ id, tipo, titulo, prioridad, estado, fecha_creacion, area_id, area, categoria_id, categoria, usuario_id, solicitante, agente_id, agente }]`
- Sin casos → `200 []` (estado vacío, no 404).
- `usuario_id` inválido → `400 { error, detalles }`.

## Cambios

- `src/api/client.ts`: `CasoResumen` + `obtenerMisCasos(usuarioId)` con `URLSearchParams`.
- `src/pages/MisSolicitudes.tsx`: lee `usuario` de `useUsuario()`, recarga al cambiar de usuario.
  Tabla ID, título, tipo, área/categoría (`area / categoria`), prioridad (badge P1 rojo/P2 ámbar/P3 gris),
  estado (badge: Pendiente ámbar, En análisis azul, En atención índigo, En validación morado, Cerrada verde),
  fecha `es-CO` corta. Estados: sin usuario, cargando, error, vacío (con link a `/crear-caso`).

## Verificación

- `npm run build` y `npm run lint` ok.
- Backend local: `?usuario_id=1 → 3 casos`, `?usuario_id=99999 → []`, `?usuario_id=abc → 400`.
- Cambiar de usuario en el selector recarga la tabla; usuario sin casos muestra el vacío.
- Sin conflictos: solo toca `client.ts`, `MisSolicitudes.tsx` + este doc.

## Trazabilidad

- HU-02 (consultar mis casos y su estado).
- Encadena con HU-01 (#24): lo registrado aparece aquí vía `usuario_id`.
