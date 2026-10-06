// 404 para rutas inexistentes, con el formato estándar de la API.
function notFound(req, res) {
  res.status(404).json({
    error: 'Recurso no encontrado',
    detalles: [`La ruta ${req.originalUrl} no existe`],
  });
}

module.exports = { notFound };
