const { Router } = require('express');
const categoriaController = require('../controllers/categoriaController');

const router = Router();

router.get('/', categoriaController.listar);
router.post('/', categoriaController.crear);
router.put('/:id', categoriaController.editar);
router.patch('/:id', categoriaController.activar);

module.exports = router;
