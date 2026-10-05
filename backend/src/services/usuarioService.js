// Catálogo de usuarios de prueba (D-02: sin autenticación real).
// Solo se exponen usuarios activos; el frontend lo usa para el selector.
const pool = require('../db/pool');

const ROLES_VALIDOS = ['solicitante', 'agente', 'validador', 'administrador'];

async function listarUsuarios(rol) {
  if (rol === undefined || rol === null || rol === '') {
    const [rows] = await pool.query(
      'SELECT id, nombre, correo, rol FROM usuario WHERE activo = TRUE ORDER BY nombre'
    );
    return rows;
  }
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, rol FROM usuario WHERE activo = TRUE AND rol = ? ORDER BY nombre',
    [rol]
  );
  return rows;
}

module.exports = { listarUsuarios, ROLES_VALIDOS };
