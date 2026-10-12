// HU-06 · Atenciones del caso (diagnóstico y solución).
// POST: solo el agente asignado, solo en En atención, diagnóstico obligatorio
// y solución opcional (R1 confirmada, D-15). No cambia el estado; deja evento
// 'atencion' en historial, en la misma transacción.
// GET: lista cronológica con el nombre del agente (para el agente y el
// validador de HU-07, sin esperar al detalle de HU-12).
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

const TEXTO_MINIMO = 10;

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function textoObligatorio(valor, campo) {
  const limpio = typeof valor === 'string' ? valor.trim() : '';
  if (limpio.length < TEXTO_MINIMO) return { error: `${campo} mínimo de ${TEXTO_MINIMO} caracteres.` };
  return { valor: limpio };
}

async function registrarAtencion(casoIdRaw, datos) {
  const errores = [];
  const casoId = aEnteroPositivo(casoIdRaw);
  if (casoId === null) errores.push('El id del caso debe ser un entero positivo.');

  const { usuario_id: usuarioIdRaw, diagnostico: diagnosticoRaw, solucion: solucionRaw } =
    datos || {};
  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (usuarioId === null) errores.push('usuario_id debe ser un entero positivo.');

  const diagnostico = textoObligatorio(diagnosticoRaw, 'Diagnóstico');
  if (diagnostico.error) errores.push(diagnostico.error);

  let solucion = null;
  if (solucionRaw !== undefined && solucionRaw !== null && String(solucionRaw).trim() !== '') {
    const chequeo = textoObligatorio(solucionRaw, 'Solución');
    if (chequeo.error) errores.push(chequeo.error);
    else solucion = chequeo.valor;
  }

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }

  const [usuarios] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
    usuarioId,
  ]);
  if (usuarios.length === 0 || !usuarios[0].activo || usuarios[0].rol !== 'agente') {
    throw createError(400, 'Datos inválidos', [
      'El usuario debe existir, estar activo y tener rol agente.',
    ]);
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [casos] = await conexion.query(
      'SELECT estado, agente_id FROM caso WHERE id = ? FOR UPDATE',
      [casoId]
    );
    if (casos.length === 0) {
      throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
    }
    if (casos[0].agente_id !== usuarioId) {
      throw createError(409, 'Solo el agente asignado registra la atención.', []);
    }
    if (casos[0].estado !== 'En atención') {
      throw createError(409, 'Solo se registra atención en un caso En atención.', []);
    }

    const [resultado] = await conexion.query(
      `INSERT INTO atencion (caso_id, diagnostico, solucion, agente_id)
       VALUES (?, ?, ?, ?)`,
      [casoId, diagnostico.valor, solucion, usuarioId]
    );
    await conexion.query(
      `INSERT INTO historial (caso_id, evento, estado_anterior, estado_nuevo, usuario_id, detalle)
       VALUES (?, 'atencion', 'En atención', 'En atención', ?, ?)`,
      [casoId, usuarioId, 'El agente registra diagnóstico y solución (HU-06).']
    );

    await conexion.commit();

    const [filas] = await pool.query(
      `SELECT a.id, a.caso_id, a.diagnostico, a.solucion, a.fecha, a.agente_id,
              u.nombre AS agente
       FROM atencion a
       INNER JOIN usuario u ON u.id = a.agente_id
       WHERE a.id = ?`,
      [resultado.insertId]
    );
    return filas[0];
  } catch (err) {
    await conexion.rollback();
    if (err.status) throw err;
    throw createError(500, 'No se pudo registrar la atención', []);
  } finally {
    conexion.release();
  }
}

async function listarAtenciones(casoIdRaw, usuarioIdRaw) {
  const casoId = aEnteroPositivo(casoIdRaw);
  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (casoId === null || usuarioId === null) {
    throw createError(400, 'Datos inválidos', [
      'El id del caso y usuario_id deben ser enteros positivos.',
    ]);
  }
  const [usuarios] = await pool.query('SELECT id, activo FROM usuario WHERE id = ?', [usuarioId]);
  if (usuarios.length === 0 || !usuarios[0].activo) {
    throw createError(400, 'Datos inválidos', ['El usuario indicado no existe o está inactivo.']);
  }
  const [casos] = await pool.query('SELECT id FROM caso WHERE id = ?', [casoId]);
  if (casos.length === 0) {
    throw createError(404, 'Caso no encontrado', [`No existe un caso con id ${casoId}.`]);
  }
  const [filas] = await pool.query(
    `SELECT a.id, a.caso_id, a.diagnostico, a.solucion, a.fecha, a.agente_id,
            u.nombre AS agente
     FROM atencion a
     INNER JOIN usuario u ON u.id = a.agente_id
     WHERE a.caso_id = ?
     ORDER BY a.fecha ASC, a.id ASC`,
    [casoId]
  );
  return filas;
}

module.exports = { registrarAtencion, listarAtenciones };
