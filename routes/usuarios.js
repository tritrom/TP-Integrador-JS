// Definición de rutas para la entidad "usuarios".
const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtenerUno);
router.post('/', usuarioController.crear);
router.put('/:id', usuarioController.actualizar);
router.delete('/:id', usuarioController.eliminar);

module.exports = router;