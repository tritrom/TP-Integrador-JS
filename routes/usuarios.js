// Definición de rutas para la entidad "usuarios".
const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/authMiddleware');

const router = Router();

// Rutas públicas (lectura y creación).
router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtenerUno);
router.post('/', usuarioController.crear);

// Rutas protegidas: requieren token JWT válido.
router.put('/:id', verificarToken, usuarioController.actualizar);
router.delete('/:id', verificarToken, usuarioController.eliminar);

module.exports = router;