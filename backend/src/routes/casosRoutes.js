const { Router } = require('express');
const casoController = require('../controllers/casoController');

const router = Router();

router.get('/', casoController.listar);
router.post('/', casoController.crear);

module.exports = router;
