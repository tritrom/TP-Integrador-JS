// Definición de rutas para la entidad "usuarios".
const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.get('/', usuarioController.listar);
router.post('/', usuarioController.crear);

module.exports = router;