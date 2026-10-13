// HU-12 · Detalle del caso con sus atenciones.
// GET /api/casos/:id?usuario_id=: fila de HU-02 + descripcion, fechas y
// atenciones cronológicas (misma forma que GET atenciones). El historial NO
// viene aquí: la pantalla lo pide a HU-08 (R2). RN-05 como historial y
// atenciones: caso ajeno para el solicitante → 404 (R3, D-17/D-18).
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

async function obtenerDetalle(casoIdRaw, usuarioIdRaw) {
  const casoId = aEnteroPositivo(casoIdRaw);
  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (casoId === null || usuarioId === null) {
    throw createError(400, 'Datos inválidos', [
      'El id del caso y usuario_id deben ser enteros positivos.',
    ]);
  }

  const [usuarios] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
    usuarioId,
  ]);
  if (usuarios.length === 0 || !usuarios[0].activo) {
    throw createError(400, 'Datos inválidos', ['El usuario indicado no existe o está inactivo.']);
  }

  const [casos] = await pool.query(
    `SELECT k.id, k.tipo, k.titulo, k.descripcion, k.prioridad, k.estado,
            k.fecha_creacion, k.fecha_asignacion, k.fecha_cierre,
            a.id AS area_id, a.nombre AS area,
            c.id AS categoria_id, c.nombre AS categoria,
            u.id AS usuario_id, u.nombre AS solicitante,
            g.id AS agente_id, g.nombre AS agente
     FROM caso k
     INNER JOIN categoria c ON c.id = k.categoria_id
     INNER JOIN area a ON a.id = c.area_id
     INNER JOIN usuario u ON u.id = k.usuario_id
     LEFT JOIN usuario g ON g.id = k.agente_id
     WHERE k.id = ?`,
    [casoId]
  );
  if (casos.length === 0) {
    throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
  }
  const caso = casos[0];
  if (usuarios[0].rol === 'solicitante' && caso.usuario_id !== usuarioId) {
    throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
  }

  const [atenciones] = await pool.query(
    `SELECT a.id, a.caso_id, a.diagnostico, a.solucion, a.fecha, a.agente_id,
            u.nombre AS agente
     FROM atencion a
     INNER JOIN usuario u ON u.id = a.agente_id
     WHERE a.caso_id = ?
     ORDER BY a.fecha ASC, a.id ASC`,
    [casoId]
  );

  return { ...caso, atenciones };
}

module.exports = { obtenerDetalle };
