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

async function cambiarEstado(casoIdRaw, datos) {
  const errores = [];
  const casoId = aEnteroPositivo(casoIdRaw);
  if (casoId === null) errores.push('El id del caso debe ser un entero positivo.');

  const { estado: nuevoEstado, usuario_id: usuarioIdRaw, detalle: detalleRaw } = datos || {};
  if (!ESTADOS.includes(nuevoEstado)) {
    errores.push(`Estado inválido. Valores permitidos: ${ESTADOS.join(', ')}.`);
  }

  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (usuarioId === null) {
    errores.push('usuario_id debe ser un entero positivo.');
  } else {
    const [filas] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
      usuarioId,
    ]);
    if (filas.length === 0) {
      errores.push('El usuario indicado no existe.');
    } else if (!filas[0].activo) {
      errores.push('El usuario indicado está inactivo.');
    } else if (filas[0].rol !== 'agente') {
      errores.push('Solo un usuario con rol agente puede cambiar el estado.');
    }
  }

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }

  const detalle =
    typeof detalleRaw === 'string' && detalleRaw.trim() !== '' ? detalleRaw.trim() : null;

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [filas] = await conexion.query('SELECT estado FROM caso WHERE id = ? FOR UPDATE', [
      casoId,
    ]);
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

module.exports = { ESTADOS, TRANSICIONES, transicionesDesde, cambiarEstado };
