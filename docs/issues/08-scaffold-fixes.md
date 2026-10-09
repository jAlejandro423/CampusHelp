# Issue #8 · Scaffold layout + fixes de contexto, menú y env

Rama base: `feature/8-scaffold-layout-user-selector` (no fusionada aún).
Rama de fixes: `feat/8-context-menu-env`.
Convención a futuro: ramas `feat/N-...` (no `feature/`).

## Problema

1. Falta `frontend/.env.example` con `VITE_API_URL`. Sin él, `API_URL` queda `undefined`,
   el fetch va a `undefined/api/usuarios` y la consola muestra `SyntaxError: Unexpected token '<'`.
2. Usuario seleccionado en `useState` local de `MainLayout.tsx`: las páginas
   (HU-01 necesita `usuario_id`, HU-02 filtrar por él) no pueden leerlo.
3. Menú desalineado con actores: validador veía dashboard (HU-10 es solo administrador),
   faltaban `Por validar (HU-07)`, `Casos (HU-09)`, `Categorías (HU-11)`.

## Cambios

- `frontend/.env.example` creado con `VITE_API_URL=http://localhost:3000`.
- `src/api/client.ts` (nuevo): `API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"`,
  tipos `Usuario/Area/Categoria`, `URLSearchParams` para `?rol=` y `?area_id=`.
  Reemplaza `src/services/api.js` (eliminado).
- `src/context/UsuarioContext.tsx` (nuevo): `UsuarioProvider` + `useUsuario()`
  expone `{ usuario, usuarios, setUsuario, loading, error }`.
  Guarda `id` en `localStorage campushelp_usuario_id`.
- `src/App.tsx`: envuelto en `<UsuarioProvider>`; rutas nuevas
  `/por-validar`, `/casos`, `/indicadores`, `/categorias`;
  `/dashboard` redirige a `/indicadores`.
- `src/layouts/MainLayout.tsx`: usa `useUsuario()`, sin `@ts-expect-error`;
  menú por rol: solicitante `HU-01/HU-02`, agente `HU-03`, validador `HU-07`,
  administrador `HU-09/HU-10/HU-11`; sin usuario → menú vacío.
- Páginas placeholder: `PorValidar.tsx`, `Casos.tsx`, `Categorias.tsx`.
- `index.html`: `lang="es"`, `<title>CampusHelp</title>`.
- Limpieza Vite: eliminados `src/App.css`, `src/assets/`, `frontend/README.md`,
  `frontend/.gitkeep`, `src/services/`.
- `docs/decisiones.md` D-07: registro de TypeScript, Tailwind y motivo de cada decisión.

## Verificación

- `npm run build` en `frontend/` (tsc + vite) sin errores.
- Con backend arriba (`GET /api/health` → 200) y `VITE_API_URL` vacío o ausente,
  el selector carga usuarios desde `http://localhost:3000` por fallback.
- Cambiar usuario persiste tras recargar (localStorage).
- Cada rol ve solo su menú; sin usuarios no se muestra menú completo.
- Sin conflictos con `develop` al fusionar en orden:
  `feature/8-...` → `develop`, luego `feat/8-context-menu-env` → `develop`.

## Trazabilidad

- Closes #8.
- Prepara `[HU-01][FRONT] #24` (usa `usuario.id` como `usuario_id`)
  y `[HU-02][FRONT] #27` (filtra por `usuario.id`).
