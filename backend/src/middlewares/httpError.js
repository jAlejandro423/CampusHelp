// Helper para errores con formato { error, detalles }.
// Uso: next(createError(400, 'Descripción inválida', ['Mínimo 10 caracteres'])).
function createError(status, message, detalles = []) {
  const err = new Error(message);
  err.status = status;
  err.detalles = detalles;
  return err;
}

module.exports = { createError };
