// GET /api/categorias — 200 [categorías] (?area_id=, ?todas=1) o 400.
// POST / PUT / PATCH — gestión solo para administrador activo (HU-11).
const { createError } = require('../middlewares/httpError');
const {
  listarCategorias,
  crearCategoria,
  editarCategoria,
  cambiarActiva,
} = require('../services/categoriaService');

async function listar(req, res, next) {
  try {
    const { area_id: areaIdRaw, todas } = req.query;
    let areaId;
    if (areaIdRaw !== undefined && areaIdRaw !== '') {
      areaId = Number(areaIdRaw);
      if (!Number.isInteger(areaId) || areaId <= 0) {
        throw createError(400, 'Datos inválidos', ['area_id debe ser un entero positivo.']);
      }
    }
    const categorias = await listarCategorias(areaId, todas);
    res.status(200).json(categorias);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    res.status(201).json(await crearCategoria(req.body));
  } catch (err) {
    next(err);
  }
}

async function editar(req, res, next) {
  try {
    res.status(200).json(await editarCategoria(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

async function activar(req, res, next) {
  try {
    res.status(200).json(await cambiarActiva(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, crear, editar, activar };
