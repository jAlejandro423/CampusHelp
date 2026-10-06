// Catálogo de categorías. Solo activas; filtro opcional por área.
// Una categoría pertenece a un área (UNIQUE area_id + nombre en BD).
const pool = require('../db/pool');

async function listarCategorias(areaId) {
  if (areaId === undefined || areaId === null || areaId === '') {
    const [rows] = await pool.query(
      'SELECT id, area_id, nombre, descripcion FROM categoria WHERE activa = TRUE ORDER BY nombre'
    );
    return rows;
  }
  const [rows] = await pool.query(
    'SELECT id, area_id, nombre, descripcion FROM categoria WHERE activa = TRUE AND area_id = ? ORDER BY nombre',
    [areaId]
  );
  return rows;
}

module.exports = { listarCategorias };
