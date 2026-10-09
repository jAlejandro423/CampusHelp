const { Router } = require('express');
const casoController = require('../controllers/casoController');

const router = Router();

router.post('/', casoController.crear);

module.exports = router;
