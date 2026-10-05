// Catálogo de áreas de atención (las 5 del taller). Solo activas.
const pool = require('../db/pool');

async function listarAreas() {
  const [rows] = await pool.query(
    'SELECT id, nombre, descripcion FROM area WHERE activa = TRUE ORDER BY nombre'
  );
  return rows;
}

module.exports = { listarAreas };
