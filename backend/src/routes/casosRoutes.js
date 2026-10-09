const { Router } = require('express');
const casoController = require('../controllers/casoController');

const router = Router();

router.get('/', casoController.listar);
router.post('/', casoController.crear);
router.patch('/:id/estado', casoController.cambiarEstadoPorId);

module.exports = router;
