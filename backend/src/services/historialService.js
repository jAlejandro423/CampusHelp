// HU-08 · Historial del caso (solo lectura).
// GET /api/casos/:id/historial?usuario_id=: orden cronológico con el nombre
// del usuario. El solicitante solo ve sus casos: pedir uno ajeno responde 404
// sin revelar si existe (R2 de HU-08, D-15). Agente, validador y administrador
// ven el de cualquier caso.
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

async function obtenerHistorial(casoIdRaw, usuarioIdRaw) {
  const errores = [];
  const casoId = aEnteroPositivo(casoIdRaw);
  if (casoId === null) errores.push('El id del caso debe ser un entero positivo.');

  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (usuarioId === null) {
    errores.push('usuario_id debe ser un entero positivo.');
  }

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }

  const [usuarios] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
    usuarioId,
  ]);
  if (usuarios.length === 0 || !usuarios[0].activo) {
    throw createError(400, 'Datos inválidos', ['El usuario indicado no existe o está inactivo.']);
  }

  const [casos] = await pool.query('SELECT id, usuario_id FROM caso WHERE id = ?', [casoId]);
  if (casos.length === 0) {
    throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
  }
  if (usuarios[0].rol === 'solicitante' && casos[0].usuario_id !== usuarioId) {
    throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
  }

  const [filas] = await pool.query(
    `SELECT h.id, h.caso_id, h.evento, h.estado_anterior, h.estado_nuevo,
            h.usuario_id, u.nombre AS usuario, h.fecha, h.detalle
     FROM historial h
     INNER JOIN usuario u ON u.id = h.usuario_id
     WHERE h.caso_id = ?
     ORDER BY h.fecha ASC, h.id ASC`,
    [casoId]
  );
  return filas;
}

module.exports = { obtenerHistorial };
