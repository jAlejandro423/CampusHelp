// Catálogo y gestión de categorías (HU-11).
// GET: solo activas, salvo ?todas=1 (admin) que incluye inactivas con su área
// y estado. POST/PUT/PATCH: solo un administrador activo (usuario_id en el
// cuerpo); nombre único dentro del área (409); sin borrado físico (R2, R4).
const pool = require('../db/pool');
const { createError } = require('../middlewares/httpError');

const NOMBRE_MINIMO = 3;
const NOMBRE_MAXIMO = 100;
const DESCRIPCION_MAXIMA = 255;

function aEnteroPositivo(valor) {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

async function listarCategorias(areaId, todas) {
  const where = ['c.activa = TRUE'];
  const parametros = [];
  if (todas === '1' || todas === 1) {
    where.length = 0;
  }
  if (areaId !== undefined && areaId !== null && areaId !== '') {
    where.push('c.area_id = ?');
    parametros.push(areaId);
  }
  const filtro = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT c.id, c.area_id, a.nombre AS area, c.nombre, c.descripcion, c.activa
     FROM categoria c
     INNER JOIN area a ON a.id = c.area_id
     ${filtro}
     ORDER BY c.nombre`,
    parametros
  );
  return rows.map((f) => ({
    id: f.id,
    area_id: f.area_id,
    area: f.area,
    nombre: f.nombre,
    descripcion: f.descripcion,
    activa: !!f.activa,
  }));
}

async function exigirAdmin(usuarioIdRaw) {
  const usuarioId = aEnteroPositivo(usuarioIdRaw);
  if (usuarioId === null) {
    throw createError(400, 'Datos inválidos', ['usuario_id debe ser un entero positivo.']);
  }
  const [filas] = await pool.query('SELECT id, rol, activo FROM usuario WHERE id = ?', [
    usuarioId,
  ]);
  if (filas.length === 0 || !filas[0].activo || filas[0].rol !== 'administrador') {
    throw createError(400, 'Datos inválidos', [
      'Solo un usuario administrador activo gestiona categorías.',
    ]);
  }
  return usuarioId;
}

function validarNombre(nombreRaw, errores) {
  const nombre = typeof nombreRaw === 'string' ? nombreRaw.trim() : '';
  if (nombre.length < NOMBRE_MINIMO || nombre.length > NOMBRE_MAXIMO) {
    errores.push(`El nombre debe tener entre ${NOMBRE_MINIMO} y ${NOMBRE_MAXIMO} caracteres.`);
    return null;
  }
  return nombre;
}

function validarDescripcion(descripcionRaw, errores) {
  if (descripcionRaw === undefined || descripcionRaw === null || descripcionRaw === '') {
    return null;
  }
  if (typeof descripcionRaw !== 'string' || descripcionRaw.trim().length > DESCRIPCION_MAXIMA) {
    errores.push(`La descripción debe tener máximo ${DESCRIPCION_MAXIMA} caracteres.`);
    return null;
  }
  return descripcionRaw.trim();
}

async function hayDuplicada(areaId, nombre, exceptoId) {
  const [filas] = await pool.query(
    'SELECT id FROM categoria WHERE area_id = ? AND nombre = ? AND id <> ? LIMIT 1',
    [areaId, nombre, exceptoId || 0]
  );
  return filas.length > 0;
}

function esDuplicadaBD(err) {
  return err && err.code === 'ER_DUP_ENTRY';
}

async function leerCategoria(id) {
  const [filas] = await pool.query(
    `SELECT c.id, c.area_id, a.nombre AS area, c.nombre, c.descripcion, c.activa
     FROM categoria c
     INNER JOIN area a ON a.id = c.area_id
     WHERE c.id = ?`,
    [id]
  );
  if (filas.length === 0) return null;
  const f = filas[0];
  return {
    id: f.id,
    area_id: f.area_id,
    area: f.area,
    nombre: f.nombre,
    descripcion: f.descripcion,
    activa: !!f.activa,
  };
}

async function crearCategoria(datos) {
  const errores = [];
  const { usuario_id: usuarioIdRaw, area_id: areaIdRaw, nombre: nombreRaw } = datos || {};
  await exigirAdmin(usuarioIdRaw);

  const areaId = aEnteroPositivo(areaIdRaw);
  if (areaId === null) {
    errores.push('area_id debe ser un entero positivo.');
  } else {
    const [areas] = await pool.query('SELECT id, activa FROM area WHERE id = ?', [areaId]);
    if (areas.length === 0 || !areas[0].activa) {
      errores.push('El área indicada no existe o está inactiva.');
    }
  }

  const nombre = validarNombre(nombreRaw, errores);
  const descripcion = validarDescripcion(datos ? datos.descripcion : undefined, errores);

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }
  if (await hayDuplicada(areaId, nombre)) {
    throw createError(409, 'Ya existe una categoría con ese nombre en el área.', []);
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO categoria (area_id, nombre, descripcion) VALUES (?, ?, ?)',
      [areaId, nombre, descripcion]
    );
    return leerCategoria(resultado.insertId);
  } catch (err) {
    if (esDuplicadaBD(err)) {
      throw createError(409, 'Ya existe una categoría con ese nombre en el área.', []);
    }
    throw createError(500, 'No se pudo crear la categoría', []);
  }
}

async function editarCategoria(idRaw, datos) {
  const errores = [];
  const id = aEnteroPositivo(idRaw);
  if (id === null) errores.push('El id de la categoría debe ser un entero positivo.');
  const { usuario_id: usuarioIdRaw, nombre: nombreRaw } = datos || {};
  await exigirAdmin(usuarioIdRaw);

  const nombre = validarNombre(nombreRaw, errores);
  const descripcion = validarDescripcion(datos ? datos.descripcion : undefined, errores);

  if (errores.length > 0) {
    throw createError(400, 'Datos inválidos', errores);
  }
  const actual = await leerCategoria(id);
  if (actual === null) {
    throw createError(404, 'Categoría no encontrada', [`No existe una categoría con id ${id}.`]);
  }
  if (await hayDuplicada(actual.area_id, nombre, id)) {
    throw createError(409, 'Ya existe una categoría con ese nombre en el área.', []);
  }

  try {
    await pool.query('UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?', [
      nombre,
      descripcion,
      id,
    ]);
    return leerCategoria(id);
  } catch (err) {
    if (esDuplicadaBD(err)) {
      throw createError(409, 'Ya existe una categoría con ese nombre en el área.', []);
    }
    throw createError(500, 'No se pudo editar la categoría', []);
  }
}

async function cambiarActiva(idRaw, datos) {
  const id = aEnteroPositivo(idRaw);
  const { usuario_id: usuarioIdRaw, activa } = datos || {};
  await exigirAdmin(usuarioIdRaw);

  if (id === null) {
    throw createError(400, 'Datos inválidos', ['El id de la categoría debe ser un entero positivo.']);
  }
  if (typeof activa !== 'boolean') {
    throw createError(400, 'Datos inválidos', ['activa debe ser un valor booleano.']);
  }
  const actual = await leerCategoria(id);
  if (actual === null) {
    throw createError(404, 'Categoría no encontrada', [`No existe una categoría con id ${id}.`]);
  }
  await pool.query('UPDATE categoria SET activa = ? WHERE id = ?', [activa, id]);
  return leerCategoria(id);
}

module.exports = { listarCategorias, crearCategoria, editarCategoria, cambiarActiva };
