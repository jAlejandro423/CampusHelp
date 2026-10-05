// Manejador central: siempre responde { error, detalles }.
// Códigos de la API: 200/201 OK, 400 validación, 404 no encontrado,
// 409 conflicto (p. ej. transición de estado inválida), 500 inesperado.
function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const detalles = err.detalles || err.details || [];
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
    detalles,
  });
}

module.exports = { errorHandler };
