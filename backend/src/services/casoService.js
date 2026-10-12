// HU-01 · Registro de incidentes y solicitudes.
// POST /api/casos: valida, inserta el caso en estado Pendiente y registra
// el evento 'creacion' en historial dentro de una transacción.
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

const TIPOS_VALIDOS = ['Incidente', 'Solicitud'];
const PRIORIDADES_VALIDAS = ['P1', 'P2', 'P3'];
const DESCRIPCION_MINIMA = 10;
const TITULO_MAXIMO = 150;

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

async function crearCaso(datos) {
  const errores = [];
  const {
    tipo,
    titulo,
    descripcion,
    prioridad,
    usuario_id: usuarioIdRaw,
    categoria_id: categoriaIdRaw,
    area_id: areaIdRaw,
  } = datos || {};

  if (!TIPOS_VALIDOS.includes(tipo)) {
    errores.push(`Tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(', ')}.`);
  }

  const tituloLimpio = typeof titulo === 'string' ? titulo.trim() : '';
  if (tituloLimpio === '') {
    errores.push('Título obligatorio.');
  } else if (tituloLimpio.length > TITULO_MAXIMO) {
    errores.push(`Título demasiado largo (máximo ${TITULO_MAXIMO} caracteres).`);
  }

  const descripcionLimpia = typeof descripcion === 'string' ? descripcion.trim() : '';
  if (descripcionLimpia.length < DESCRIPCION_MINIMA) {
    errores.push(`Descripción mínima de ${DESCRIPCION_MINIMA} caracteres.`);
  }

  if (!PRIORIDADES_VALIDAS.includes(prioridad)) {
    errores.push(`Prioridad inválida. Valores permitidos: ${PRIORIDADES_VALIDAS.join(', ')}.`);
  }

  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  const categoriaId = aEnteroPositivo(categoriaIdRaw);
  const areaId = aEnteroPositivo(areaIdRaw);
  if (usuarioId === null) errores.push('usuario_id debe ser un entero positivo.');
  if (categoriaId === null) errores.push('categoria_id debe ser un entero positivo.');
  if (areaId === null) errores.push('area_id debe ser un entero positivo.');

  let area = null;
  let categoria = null;

  if (usuarioId !== null) {
    const [filas] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
      usuarioId,
    ]);
    if (filas.length === 0) {
      errores.push('El usuario indicado no existe.');
    } else if (!filas[0].activo) {
      errores.push('El usuario indicado está inactivo.');
    } else if (filas[0].rol !== 'solicitante') {
      errores.push('Solo un usuario con rol solicitante puede registrar casos.');
    }
  }

  if (areaId !== null) {
    const [filas] = await pool.query('SELECT id, activa FROM area WHERE id = ?', [areaId]);
    if (filas.length === 0) {
      errores.push('El área indicada no existe.');
    } else if (!filas[0].activa) {
      errores.push('El área indicada está inactiva.');
    } else {
      area = filas[0];
    }
  }

  if (categoriaId !== null) {
    const [filas] = await pool.query('SELECT id, area_id, activa FROM categoria WHERE id = ?', [
      categoriaId,
    ]);
    if (filas.length === 0) {
      errores.push('La categoría indicada no existe.');
    } else if (!filas[0].activa) {
      errores.push('La categoría indicada está inactiva.');
    } else {
      categoria = filas[0];
    }
  }

  if (area !== null && categoria !== null && categoria.area_id !== area.id) {
    errores.push('La categoría no pertenece al área indicada.');
  }

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [resultado] = await conexion.query(
      `INSERT INTO caso (tipo, titulo, descripcion, prioridad, estado, usuario_id, categoria_id)
       VALUES (?, ?, ?, ?, 'Pendiente', ?, ?)`,
      [tipo, tituloLimpio, descripcionLimpia, prioridad, usuarioId, categoriaId]
    );
    const casoId = resultado.insertId;

    await conexion.query(
      `INSERT INTO historial (caso_id, evento, estado_anterior, estado_nuevo, usuario_id, detalle)
       VALUES (?, 'creacion', NULL, 'Pendiente', ?, ?)`,
      [casoId, usuarioId, 'Caso registrado desde POST /api/casos (HU-01).']
    );

    await conexion.commit();

    const [filas] = await pool.query(
      `SELECT id, tipo, titulo, descripcion, prioridad, estado,
              usuario_id, categoria_id, agente_id,
              fecha_creacion, fecha_asignacion, fecha_cierre
       FROM caso WHERE id = ?`,
      [casoId]
    );
    return filas[0];
  } catch (err) {
    await conexion.rollback();
    if (err.status) throw err;
    throw createError(500, 'No se pudo registrar el caso', []);
  } finally {
    conexion.release();
  }
}

// HU-02 · Mis casos. HU-03 (bandeja) y HU-09 (filtros) reutilizarán este
// mismo SELECT agregando condiciones con AND (ver D-10).
// Forma de fila según la ficha HU-02: nombres de área, categoría,
// solicitante y agente (NULL cuando no hay asignado).
const SELECT_LISTADO = `
  SELECT k.id, k.tipo, k.titulo, k.prioridad, k.estado, k.fecha_creacion,
         a.id AS area_id, a.nombre AS area,
         c.id AS categoria_id, c.nombre AS categoria,
         u.id AS usuario_id, u.nombre AS solicitante,
         g.id AS agente_id, g.nombre AS agente
  FROM caso k
  INNER JOIN categoria c ON c.id = k.categoria_id
  INNER JOIN area a ON a.id = c.area_id
  INNER JOIN usuario u ON u.id = k.usuario_id
  LEFT JOIN usuario g ON g.id = k.agente_id
`;

async function listarCasos(filtros) {
  const condiciones = [];
  const parametros = [];

  const usuarioIdRaw = filtros ? filtros.usuario_id : undefined;
  if (usuarioIdRaw !== undefined && usuarioIdRaw !== '') {
    const usuarioId = aEnteroPositivo(usuarioIdRaw);
    if (usuarioId === null) {
      throw createError(400, 'Datos inválidos', ['usuario_id debe ser un entero positivo.']);
    }
    condiciones.push('k.usuario_id = ?');
    parametros.push(usuarioId);
  }

  // HU-07 (D-15): filtro estado= para Por validar; HU-09 lo reutiliza.
  const ESTADOS_FILTRO = ['Pendiente', 'En análisis', 'En atención', 'En validación', 'Cerrada'];
  const estadoRaw = filtros ? filtros.estado : undefined;
  if (estadoRaw !== undefined && estadoRaw !== '') {
    if (!ESTADOS_FILTRO.includes(estadoRaw)) {
      throw createError(400, 'Datos inválidos', [
        `estado inválido. Valores permitidos: ${ESTADOS_FILTRO.join(', ')}.`,
      ]);
    }
    condiciones.push('k.estado = ?');
    parametros.push(estadoRaw);
  }

  // HU-03 · Bandeja del agente: solo casos no cerrados, P1 → P3 y, dentro de
  // cada prioridad, del más antiguo al más reciente. El ENUM prioridad se
  // ordenó como ('P1','P2','P3'), así que MySQL lo ordena en ese orden.
  // Cualquier valor de bandeja distinto de 1 se ignora (ficha HU-03).
  const bandejaRaw = filtros ? filtros.bandeja : undefined;
  const esBandeja = bandejaRaw === '1' || bandejaRaw === 1;
  if (esBandeja) {
    condiciones.push("k.estado <> 'Cerrada'");
  }

  const whereFinal = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const orden = esBandeja
    ? 'ORDER BY k.prioridad ASC, k.fecha_creacion ASC, k.id ASC'
    : 'ORDER BY k.fecha_creacion DESC, k.id DESC';
  const [filas] = await pool.query(`${SELECT_LISTADO} ${whereFinal} ${orden}`, parametros);
  return filas;
}

module.exports = { crearCaso, listarCasos };
