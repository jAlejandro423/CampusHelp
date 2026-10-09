// POST /api/casos — 201 con el caso creado o 400 con el detalle de errores.
// GET /api/casos?usuario_id= — 200 con el listado (forma de fila HU-02).
const { crearCaso, listarCasos } = require('../services/casoService');

async function crear(req, res, next) {
  try {
    const caso = await crearCaso(req.body);
    res.status(201).json(caso);
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const casos = await listarCasos(req.query);
    res.status(200).json(casos);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar };
