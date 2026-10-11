// HU-05 · Máquina de estados del caso.
// Módulo único reutilizable por HU-04 (asignar), HU-06 (atención) y HU-07
// (validación). El endpoint genérico PATCH /api/casos/:id/estado solo avanza
// un paso; Cerrada y la devolución quedan reservadas a HU-07 (D-08).
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

const ESTADOS = ['Pendiente', 'En análisis', 'En atención', 'En validación', 'Cerrada'];

const TRANSICIONES = {
  Pendiente: ['En análisis'],
  'En análisis': ['En atención'],
  'En atención': ['En validación'],
  'En validación': [],
  Cerrada: [],
};

function transicionesDesde(estado) {
  return TRANSICIONES[estado] || [];
}

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

// Valida que el usuario exista, esté activo y tenga rol agente (D-08).
// Agrega el mensaje a errores y devuelve el id, o null si hay fallo.
async function validarAgente(usuarioIdRaw, errores, verbo) {
  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (usuarioId === null) {
    errores.push('usuario_id debe ser un entero positivo.');
    return null;
  }
  const [filas] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
    usuarioId,
  ]);
  if (filas.length === 0) {
    errores.push('El usuario indicado no existe.');
    return null;
  }
  if (!filas[0].activo) {
    errores.push('El usuario indicado está inactivo.');
    return null;
  }
  if (filas[0].rol !== 'agente') {
    errores.push(`Solo un usuario con rol agente puede ${verbo}.`);
    return null;
  }
  return usuarioId;
}

async function cambiarEstado(casoIdRaw, datos) {
  const errores = [];
  const casoId = aEnteroPositivo(casoIdRaw);
  if (casoId === null) errores.push('El id del caso debe ser un entero positivo.');

  const { estado: nuevoEstado, usuario_id: usuarioIdRaw, detalle: detalleRaw } = datos || {};
  if (!ESTADOS.includes(nuevoEstado)) {
    errores.push(`Estado inválido. Valores permitidos: ${ESTADOS.join(', ')}.`);
  }

  const usuarioId = await validarAgente(usuarioIdRaw, errores, 'cambiar el estado');

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }

  const detalle =
    typeof detalleRaw === 'string' && detalleRaw.trim() !== '' ? detalleRaw.trim() : null;

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [filas] = await conexion.query(
      'SELECT estado, agente_id FROM caso WHERE id = ? FOR UPDATE',
      [casoId]
    );
    if (filas.length === 0) {
      throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
    }
    const actual = filas[0].estado;

    if (actual === 'Cerrada') {
      throw createError(409, 'El caso está Cerrado y no puede cambiar.', []);
    }
    if (nuevoEstado === actual) {
      throw createError(409, `El caso ya está en estado ${actual}.`, [
        `Transiciones permitidas: ${transicionesDesde(actual).join(', ') || 'ninguna'}.`,
      ]);
    }
    if (!transicionesDesde(actual).includes(nuevoEstado)) {
      if (nuevoEstado === 'Cerrada') {
        throw createError(409, 'Solo se llega a Cerrada por validación (HU-07).', []);
      }
      if (actual === 'En validación' && nuevoEstado === 'En atención') {
        throw createError(409, 'La devolución se hace por validación (HU-07).', []);
      }
      throw createError(409, `Transición no permitida desde ${actual}.`, [
        `Transiciones permitidas: ${transicionesDesde(actual).join(', ') || 'ninguna'}.`,
      ]);
    }
    // HU-04 (D-14): para pasar a En atención, el caso debe tener agente.
    if (nuevoEstado === 'En atención' && filas[0].agente_id === null) {
      throw createError(409, 'Para pasar a En atención, el caso debe tener un agente asignado.', []);
    }

    await conexion.query('UPDATE caso SET estado = ? WHERE id = ?', [nuevoEstado, casoId]);
    await conexion.query(
      `INSERT INTO historial (caso_id, evento, estado_anterior, estado_nuevo, usuario_id, detalle)
       VALUES (?, 'cambio_estado', ?, ?, ?, ?)`,
      [casoId, actual, nuevoEstado, usuarioId, detalle]
    );

    await conexion.commit();

    const [actualizado] = await pool.query(
      `SELECT id, tipo, titulo, descripcion, prioridad, estado,
              usuario_id, categoria_id, agente_id,
              fecha_creacion, fecha_asignacion, fecha_cierre
       FROM caso WHERE id = ?`,
      [casoId]
    );
    return actualizado[0];
  } catch (err) {
    await conexion.rollback();
    if (err.status) throw err;
    throw createError(500, 'No se pudo cambiar el estado', []);
  } finally {
    conexion.release();
  }
}

module.exports = { ESTADOS, TRANSICIONES, transicionesDesde, cambiarEstado, asignarCaso };

// HU-04 · Asignarme un caso (D-14).
// PATCH /api/casos/:id/asignar con { usuario_id }: el agente se asigna a sí
// mismo. Solo casos sin agente en Pendiente o En análisis. Si está Pendiente,
// pasa a En análisis; si ya está En análisis, solo se asigna. Un solo evento
// 'asignacion' en la misma transacción, con FOR UPDATE anti-doble-asignación.
async function asignarCaso(casoIdRaw, datos) {
  const errores = [];
  const casoId = aEnteroPositivo(casoIdRaw);
  if (casoId === null) errores.push('El id del caso debe ser un entero positivo.');

  const { usuario_id: usuarioIdRaw } = datos || {};
  const usuarioId = await validarAgente(usuarioIdRaw, errores, 'asignarse casos');

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [filas] = await conexion.query(
      'SELECT estado, agente_id FROM caso WHERE id = ? FOR UPDATE',
      [casoId]
    );
    if (filas.length === 0) {
      throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
    }
    const { estado: actual, agente_id: agenteActual } = filas[0];

    if (agenteActual !== null) {
      throw createError(409, 'El caso ya tiene un agente asignado.', []);
    }
    if (actual !== 'Pendiente' && actual !== 'En análisis') {
      throw createError(409, `Solo se asignan casos Pendiente o En análisis (está ${actual}).`, []);
    }

    const nuevoEstado = actual === 'Pendiente' ? 'En análisis' : actual;
    await conexion.query(
      'UPDATE caso SET agente_id = ?, fecha_asignacion = NOW(), estado = ? WHERE id = ?',
      [usuarioId, nuevoEstado, casoId]
    );
    await conexion.query(
      `INSERT INTO historial (caso_id, evento, estado_anterior, estado_nuevo, usuario_id, detalle)
       VALUES (?, 'asignacion', ?, ?, ?, ?)`,
      [casoId, actual, nuevoEstado, usuarioId, 'El agente asume la atención del caso (HU-04).']
    );

    await conexion.commit();

    const [actualizado] = await pool.query(
      `SELECT id, tipo, titulo, descripcion, prioridad, estado,
              usuario_id, categoria_id, agente_id,
              fecha_creacion, fecha_asignacion, fecha_cierre
       FROM caso WHERE id = ?`,
      [casoId]
    );
    return actualizado[0];
  } catch (err) {
    await conexion.rollback();
    if (err.status) throw err;
    throw createError(500, 'No se pudo asignar el caso', []);
  } finally {
    conexion.release();
  }
}
