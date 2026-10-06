// GET /api/health → 200 { status, db } o 500 { error, detalles }.
const { checkDatabase } = require('../services/healthService');

async function getHealth(req, res, next) {
  try {
    await checkDatabase();
    res.status(200).json({ status: 'ok', db: 'up' });
  } catch (err) {
    err.status = 500;
    err.message = 'Base de datos no disponible';
    next(err);
  }
}

module.exports = { getHealth };
