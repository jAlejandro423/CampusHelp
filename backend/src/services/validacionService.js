// HU-07 · Validación del validador (aprobar o devolver).
// POST /api/casos/:id/validacion con { usuario_id, accion, motivo? }.
// Única vía a Cerrada y única vía de devolución (RN-08, D-08):
// - aprobar: En validación → Cerrada + fecha_cierre, evento 'cierre'.
// - devolver: En validación → En atención (conserva agente_id), motivo
//   obligatorio en historial.detalle, evento 'devolucion'.
// Todo en transacción con FOR UPDATE. Solo rol validador.
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

const ACCIONES = ['aprobar', 'devolver'];
const MOTIVO_MINIMO = 10;

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

async function validarCaso(casoIdRaw, datos) {
  const errores = [];
  const casoId = aEnteroPositivo(casoIdRaw);
  if (casoId === null) errores.push('El id del caso debe ser un entero positivo.');

  const { usuario_id: usuarioIdRaw, accion, motivo: motivoRaw } = datos || {};
  if (!ACCIONES.includes(accion)) {
    errores.push('Acción inválida. Valores permitidos: aprobar, devolver.');
  }

  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (usuarioId === null) {
    errores.push('usuario_id debe ser un entero positivo.');
  } else {
    const [filas] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
      usuarioId,
    ]);
    if (filas.length === 0 || !filas[0].activo) {
      errores.push('El usuario indicado no existe o está inactivo.');
    } else if (filas[0].rol !== 'validador') {
      errores.push('Solo un usuario con rol validador puede validar casos.');
    }
  }

  let motivo = null;
  if (accion === 'devolver') {
    motivo = typeof motivoRaw === 'string' ? motivoRaw.trim() : '';
    if (motivo.length < MOTIVO_MINIMO) {
      errores.push(`El motivo de devolución mínimo es de ${MOTIVO_MINIMO} caracteres.`);
      motivo = null;
    }
  } else if (motivoRaw !== undefined && motivoRaw !== null && String(motivoRaw).trim() !== '') {
    motivo = String(motivoRaw).trim();
  }

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
    if (filas[0].estado !== 'En validación') {
      throw createError(
        409,
        `Solo se validan casos En validación (está ${filas[0].estado}).`,
        []
      );
    }

    if (accion === 'aprobar') {
      await conexion.query(
        'UPDATE caso SET estado = ?, fecha_cierre = NOW() WHERE id = ?',
        ['Cerrada', casoId]
      );
      await conexion.query(
        `INSERT INTO historial (caso_id, evento, estado_anterior, estado_nuevo, usuario_id, detalle)
         VALUES (?, 'cierre', 'En validación', 'Cerrada', ?, ?)`,
        [casoId, usuarioId, motivo || 'Validación aprobada; se cierra el caso.']
      );
    } else {
      await conexion.query('UPDATE caso SET estado = ? WHERE id = ?', ['En atención', casoId]);
      await conexion.query(
        `INSERT INTO historial (caso_id, evento, estado_anterior, estado_nuevo, usuario_id, detalle)
         VALUES (?, 'devolucion', 'En validación', 'En atención', ?, ?)`,
        [casoId, usuarioId, motivo]
      );
    }

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
    throw createError(500, 'No se pudo validar el caso', []);
  } finally {
    conexion.release();
  }
}

module.exports = { validarCaso };
