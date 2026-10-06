const { Router } = require('express');
const areaController = require('../controllers/areaController');

const router = Router();

router.get('/', areaController.listar);

module.exports = router;
