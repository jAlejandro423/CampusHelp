# Issue #98 · [HU-09][FRONT] Pantalla Casos con filtros

Rama: `feat/98-casos-filtros` (desde `develop` con #97 fusionado).
Ficha: `docs/historias/HU-09.md` (reglas 1-5, E1-E4, R3: al cambiar cada selector).

## Contrato BACK (casoService.listarCasos, ya en develop)

`GET /api/casos?estado=&tipo=&area_id=&categoria_id=&prioridad= → 200`
combinados con AND; vacío no restringe; fuera de dominio → `400`;
categoría de otra área → `[]` (R2).

## Cambios FRONT

- `src/api/client.ts`: `FiltrosCasos` + `filtrarCasos()` (solo envía filtros
  no vacíos, propaga `ApiError` con detalles del `400`).
- `src/pages/Casos.tsx` (era placeholder): 5 selectores (categoría dependiente
  del área vía `GET /api/categorias?area_id=`), **Limpiar** (E3), tabla con las
  10 columnas de la ficha + **Ver historial** (reusa HU-08). Cada cambio pide
  de nuevo al backend, sin filtrar en memoria (regla 2). Vacío → `Sin resultados` (E2).

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `?tipo=Incidente&prioridad=P1 → [1, 3]` (AND); `?tipo=Solicitud&prioridad=P1 → []`;
  `?prioridad=P9 → 400` con detalles (E1/CP-10, E2, E4).
- Limpiar restaura la lista completa (E3).
- Sin conflictos: `client.ts`, `Casos.tsx` + este doc.

## Trazabilidad

- HU-09 E1-E4, CP-10. Desbloquea #99 (QA).
