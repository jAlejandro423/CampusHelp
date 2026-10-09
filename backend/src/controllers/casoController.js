// POST /api/casos — 201 con el caso creado o 400 con el detalle de errores.
const { crearCaso } = require('../services/casoService');

async function crear(req, res, next) {
  try {
    const caso = await crearCaso(req.body);
    res.status(201).json(caso);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear };
