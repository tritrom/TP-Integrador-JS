// Rutas que demuestran el uso de Sequelize (ORM).
const { Router } = require('express');
const ormController = require('../controllers/ormController');

const router = Router();

router.get('/usuarios', ormController.listarConORM);
router.get('/usuarios/:id/pedidos', ormController.usuarioConPedidos);
router.get('/comparar', ormController.compararResultados);

module.exports = router;