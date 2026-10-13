const { Router } = require('express');
const indicadoresController = require('../controllers/indicadoresController');

const router = Router();

router.get('/', indicadoresController.indicadores);

module.exports = router;
