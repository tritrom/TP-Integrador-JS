// Rutas de autenticación.
const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

// POST /api/login -> autentica y devuelve un JWT.
router.post('/login', authController.login);

module.exports = router;