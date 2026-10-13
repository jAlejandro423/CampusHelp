// GET /api/indicadores — 200 con los totales y promedios (HU-10).
const { obtenerIndicadores } = require('../services/indicadoresService');

async function indicadores(req, res, next) {
  try {
    res.status(200).json(await obtenerIndicadores());
  } catch (err) {
    next(err);
  }
}

module.exports = { indicadores };
