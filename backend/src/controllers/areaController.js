// GET /api/areas — 200 [áreas activas].
const { listarAreas } = require('../services/areaService');

async function listar(req, res, next) {
  try {
    const areas = await listarAreas();
    res.status(200).json(areas);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar };
