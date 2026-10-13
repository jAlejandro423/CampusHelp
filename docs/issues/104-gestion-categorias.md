# Issue #104 · [HU-11][FRONT] Pantalla de gestión de categorías

Rama: `feat/104-gestion-categorias` (desde `develop` con #103 fusionado).
Ficha: `docs/historias/HU-11.md` (reglas 1-5, E1-E5).

## Contrato BACK (categoriaService, ya en develop)

`GET /api/categorias?todas=1` (activas e inactivas con área y estado);
`POST` (área + nombre 3-100 + descripción opcional); `PUT` (nombre y
descripción, sin área); `PATCH` (activa booleano). Todo con `usuario_id` de
administrador activo (si no, `400`); duplicado en el área → `409`.

## Cambios FRONT (con la auditoría #103)

- `src/api/client.ts`: `CategoriaAdmin`, `listarCategoriasTodas()`,
  `crearCategoria()`, `editarCategoria()`, `cambiarActivaCategoria()`
  (helper común con `ApiError`).
- `src/pages/Categorias.tsx` (era placeholder): lista agrupada por área con
  badge Activa/Inactiva; crear (área + nombre + descripción); editar
  **precargando nombre y descripción y enviando siempre ambas** (PUT reemplaza:
  sin descripción quedaría NULL); Activar/Desactivar por fila; errores 400/409
  en aviso sobre la lista sin ocultarla (lección DEF-02); botones solo para
  administrador.

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `?todas=1 → 16` con área y estado; duplicada → `409`; no-admin → `400`
  (E3, E5, sin mutar).
- Sin conflictos: `client.ts`, `Categorias.tsx` + este doc.

## Trazabilidad

- HU-11 E1-E5. Desbloquea #105 (QA). Lo verifica la #105 (nota PUT).
