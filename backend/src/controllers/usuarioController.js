// GET /api/usuarios?rol= — 200 [usuarios] o 400 si el rol es inválido.
const { createError } = require('../middlewares/httpError');
const { listarUsuarios, ROLES_VALIDOS } = require('../services/usuarioService');

async function listar(req, res, next) {
  try {
    const { rol } = req.query;
    if (rol !== undefined && !ROLES_VALIDOS.includes(rol)) {
      throw createError(400, 'Rol inválido', [
        `Valores permitidos: ${ROLES_VALIDOS.join(', ')}`,
      ]);
    }
    const usuarios = await listarUsuarios(rol);
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar };
