const { Router } = require('express');
const casoController = require('../controllers/casoController');

const router = Router();

router.get('/', casoController.listar);
router.post('/', casoController.crear);
router.get('/:id/historial', casoController.historialPorId);
router.post('/:id/atenciones', casoController.crearAtencion);
router.get('/:id/atenciones', casoController.listarAtencionesPorId);
router.patch('/:id/estado', casoController.cambiarEstadoPorId);
router.patch('/:id/asignar', casoController.asignarPorId);

module.exports = router;
