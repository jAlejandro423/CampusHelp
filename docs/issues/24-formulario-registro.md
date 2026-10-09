# Issue #24 · [HU-01][FRONT] Formulario de registro de caso

Rama: `feature/HU-01-formulario-registro` (pedida explícitamente; a futuro usar `feat/24-...`).
Backend requerido: `POST /api/casos` (#23) + `GET /api/areas`, `GET /api/categorias?area_id=` (#7).

> Nota de rutas: el issue menciona `UserContext.jsx`, `services/api.js`, `CrearCaso.jsx`,
> `MainLayout.jsx`. En el repo real son `.tsx` + `src/api/client.ts` +
> `src/context/UsuarioContext.tsx` (D-07). Se implementó sobre esos archivos.

## Contrato usado (casoService.js)

`POST /api/casos` espera:
`{ tipo: Incidente|Solicitud, titulo (1-150), descripcion (≥10), prioridad: P1|P2|P3, usuario_id, categoria_id, area_id }`
- `usuario_id` debe existir, activo y con rol `solicitante` (no `solicitante_id`).
- `area_id` y `categoria_id` deben existir, activas, y `categoria.area_id === area.id`.
- Responde `201` con el caso (`id`, `estado: Pendiente`, fechas) o
  `400 { error: Datos inválidos, detalles: [...] }`.

## Cambios frontend

- `src/api/client.ts`: tipos `TipoCaso`, `PrioridadCaso`, `CrearCasoPayload`, `CasoCreado`,
  clase `ApiError { status, detalles }` que parsea `{ error, detalles }`, y
  `crearCaso(payload)` con `POST /api/casos` JSON.
- `src/pages/CrearCaso.tsx` reescrito:
  - `useUsuario()` para `usuario_id`; aviso si el rol no es `solicitante`.
  - Catálogos con `obtenerAreas()` al montar y `obtenerCategorias(areaId)` dependiente;
    al cambiar área se limpia la categoría si ya no pertenece.
  - Tipo con radio-cards, prioridad `P1-Alta/P2-Media/P3-Baja`, título (max 150),
    descripción con contador `n / mínimo 10`, error visual y submit deshabilitado si `<10`.
  - Submit con spinner, anti-doble envío, banner de error con `detalles` del backend,
    tarjeta de éxito `¡Caso #ID registrado con éxito!` + `Ir a Mis Solicitudes` + `Registrar otro caso` + reset.
  - Estilo Tailwind coherente con `MainLayout`.

## Verificación

- `npm run build` ok (tsc + vite).
- Backend local `GET /api/health → { ok, up }`, `GET /api/areas → 5 áreas`.
- `POST` inválido (descripción corta) → `400 { Datos inválidos, [Descripción mínima...] }`
  y el formulario lo muestra en el banner con la lista de detalles.
- Selects dependientes impiden el `400 La categoría no pertenece al área indicada`
  (ej: categoría 7 es de área 2, no de área 3; Wi-Fi correcto es categoría 8 / área 3).
- Sin conflictos: solo toca `frontend/src/api/client.ts` y `frontend/src/pages/CrearCaso.tsx`
  más este doc; no pisa `develop` ni las ramas de backend (#23, #26).

## Trazabilidad

- HU-01 (registro con ID persistido, en bandeja, sobrevive reinicio).
- CP-01 (válido → ID), CP-02 (sin descripción → rechaza), CP-03 (Solicitud almacenada).
- Prepara HU-02 (#27): el caso creado se lista con `GET /api/casos?usuario_id=`.
