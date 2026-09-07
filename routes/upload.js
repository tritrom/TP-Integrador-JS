// Rutas de subida de archivos.
const { Router } = require('express');
const upload = require('../middlewares/uploadMiddleware');
const verificarToken = require('../middlewares/authMiddleware');
const uploadController = require('../controllers/uploadController');

const router = Router();

// POST /api/upload -> sube un archivo a la carpeta pública (campo "archivo").
router.post('/upload', upload.single('archivo'), uploadController.subirArchivo);

// POST /api/upload/perfil/:id -> sube la foto de perfil de un usuario (requiere token).
router.post(
    '/upload/perfil/:id',
    verificarToken,
    upload.single('archivo'),
    uploadController.subirFotoPerfil
);

module.exports = router;