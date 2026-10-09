const { Router } = require('express');
const healthRoutes = require('./healthRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const areasRoutes = require('./areasRoutes');
const categoriasRoutes = require('./categoriasRoutes');

const casosRoutes = require('./casosRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/casos', casosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/areas', areasRoutes);
router.use('/categorias', categoriasRoutes);

module.exports = router;
