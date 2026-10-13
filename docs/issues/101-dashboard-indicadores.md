# Issue #101 · [HU-10][FRONT] Dashboard de indicadores

Rama: `feat/101-dashboard-indicadores` (desde `develop` con #100 fusionado).
Ficha: `docs/historias/HU-10.md` (reglas 1-4, E1-E3, R2: sin librería).

## Contrato BACK (indicadoresService, ya en develop)

`GET /api/indicadores → 200 { total, por_estado, por_tipo, por_prioridad, por_area, tiempos }`
con todos los valores (incluidos 0) y promedios en horas con un decimal
(`null` sin datos).

## Cambios FRONT

- `src/api/client.ts`: `Indicadores` + `obtenerIndicadores()`.
- `src/pages/Dashboard.tsx` (era placeholder): 3 tarjetas (total y los dos
  promedios, `Sin datos` si `null`) + 4 grupos con barras CSS (R2) y botón
  **Actualizar**. Recalcula al recargar: E2 se cumple sin estado local.

## Verificación

- `npm run build` y `lint` ok (0 errores).
- `GET /api/indicadores` real: total 6, grupos completos y tiempos
  `7.1 h / 41 h` (E1 contra SQL directa).
- Sin cerrados el promedio de cierre sería `null → Sin datos` (E3, por diseño).
- Los promedios se muestran siempre con un decimal (`41.0 h`), aunque el backend envíe `41` (hallado en la auditoría).
- Sin conflictos: `client.ts`, `Dashboard.tsx` + este doc.

## Trazabilidad

- HU-10 E1-E3. Desbloquea #102 (QA).
