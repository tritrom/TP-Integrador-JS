// Rutas de operaciones transaccionales.
const { Router } = require('express');
const transaccionController = require('../controllers/transaccionController');

const router = Router();

router.post('/registro', transaccionController.registrarConHistorial);

module.exports = router;