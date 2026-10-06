// GET /api/categorias?area_id= — 200 [categorías] o 400 si area_id no es entero.
const { createError } = require('../middlewares/httpError');
const { listarCategorias } = require('../services/categoriaService');

async function listar(req, res, next) {
  try {
    const { area_id: areaIdRaw } = req.query;
    let areaId;
    if (areaIdRaw !== undefined && areaIdRaw !== '') {
      areaId = Number(areaIdRaw);
      if (!Number.isInteger(areaId) || areaId <= 0) {
        throw createError(400, 'area_id inválido', [
          'area_id debe ser un entero positivo',
        ]);
      }
    }
    const categorias = await listarCategorias(areaId);
    res.status(200).json(categorias);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar };
