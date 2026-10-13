// HU-10 · Indicadores del servicio.
// GET /api/indicadores: todo calculado en SQL sobre los datos reales en el
// momento de la consulta (regla 1). Los grupos listan todos sus valores,
// incluidos los que están en 0 (regla 2). Promedios en horas con un decimal
// (R1); null cuando no hay casos para el promedio (regla 4).
const pool = require('../db/pool');

async function obtenerIndicadores() {
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM caso');

  const [porEstado] = await pool.query(
    `SELECT e.estado, COUNT(k.id) AS total
     FROM (
       SELECT 'Pendiente' AS estado UNION ALL SELECT 'En análisis'
       UNION ALL SELECT 'En atención' UNION ALL SELECT 'En validación'
       UNION ALL SELECT 'Cerrada'
     ) e
     LEFT JOIN caso k ON k.estado = e.estado
     GROUP BY e.estado`
  );

  const [porTipo] = await pool.query(
    `SELECT e.tipo, COUNT(k.id) AS total
     FROM (SELECT 'Incidente' AS tipo UNION ALL SELECT 'Solicitud') e
     LEFT JOIN caso k ON k.tipo = e.tipo
     GROUP BY e.tipo`
  );

  const [porPrioridad] = await pool.query(
    `SELECT e.prioridad, COUNT(k.id) AS total
     FROM (SELECT 'P1' AS prioridad UNION ALL SELECT 'P2' UNION ALL SELECT 'P3') e
     LEFT JOIN caso k ON k.prioridad = e.prioridad
     GROUP BY e.prioridad`
  );

  // Todas las áreas con casos (R4: las inactivas aparecen si tienen casos);
  // las 5 de los seeds quedan listadas, con 0 si no tienen casos.
  const [porArea] = await pool.query(
    `SELECT a.id AS area_id, a.nombre AS area, COUNT(k.id) AS total
     FROM area a
     LEFT JOIN categoria c ON c.area_id = a.id
     LEFT JOIN caso k ON k.categoria_id = c.id
     GROUP BY a.id, a.nombre
     ORDER BY a.id`
  );

  const [[tiempos]] = await pool.query(
    `SELECT
       ROUND(AVG(TIMESTAMPDIFF(SECOND, fecha_creacion, fecha_asignacion)) / 3600, 1)
         AS promedio_horas_asignacion,
       COUNT(fecha_asignacion) AS casos_asignados,
       ROUND(AVG(CASE WHEN estado = 'Cerrada' AND fecha_cierre IS NOT NULL
         THEN TIMESTAMPDIFF(SECOND, fecha_creacion, fecha_cierre) END) / 3600, 1)
         AS promedio_horas_cierre,
       COUNT(CASE WHEN estado = 'Cerrada' AND fecha_cierre IS NOT NULL THEN 1 END)
         AS casos_cerrados
     FROM caso`
  );

  const numeroONulo = (v) => (v === null ? null : Number(v));

  return {
    total: Number(total),
    por_estado: porEstado.map((f) => ({ estado: f.estado, total: Number(f.total) })),
    por_tipo: porTipo.map((f) => ({ tipo: f.tipo, total: Number(f.total) })),
    por_prioridad: porPrioridad.map((f) => ({ prioridad: f.prioridad, total: Number(f.total) })),
    por_area: porArea.map((f) => ({ area_id: f.area_id, area: f.area, total: Number(f.total) })),
    tiempos: {
      promedio_horas_asignacion: numeroONulo(tiempos.promedio_horas_asignacion),
      casos_asignados: Number(tiempos.casos_asignados),
      promedio_horas_cierre: numeroONulo(tiempos.promedio_horas_cierre),
      casos_cerrados: Number(tiempos.casos_cerrados),
    },
  };
}

module.exports = { obtenerIndicadores };
