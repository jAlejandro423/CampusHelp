// POST /api/casos — 201 con el caso creado o 400 con el detalle de errores.
// GET /api/casos?usuario_id= — 200 con el listado (forma de fila HU-02).
// PATCH /api/casos/:id/estado — 200 con el caso actualizado, 404 o 409.
const { crearCaso, listarCasos } = require('../services/casoService');
const { cambiarEstado, asignarCaso } = require('../services/estados');
const { obtenerHistorial } = require('../services/historialService');

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

async function cambiarEstadoPorId(req, res, next) {
  try {
    const caso = await cambiarEstado(req.params.id, req.body);
    res.status(200).json(caso);
  } catch (err) {
    next(err);
  }
}

async function asignarPorId(req, res, next) {
  try {
    const caso = await asignarCaso(req.params.id, req.body);
    res.status(200).json(caso);
  } catch (err) {
    next(err);
  }
}

async function historialPorId(req, res, next) {
  try {
    const historial = await obtenerHistorial(req.params.id, req.query.usuario_id);
    res.status(200).json(historial);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar, cambiarEstadoPorId, asignarPorId, historialPorId };
