// Controlador de autenticación: login con credenciales y emisión de JWT.
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuario');

const SECRET = process.env.JWT_SECRET || 'clave_secreta_desarrollo';

// POST /api/login -> valida credenciales y genera un token válido.
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Los campos email y password son obligatorios.' });
        }

        const usuario = await usuarioModel.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Los usuarios sin password (creados antes del módulo 8) no pueden autenticarse.
        if (!usuario.password) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Genera el JWT con expiración de 2 horas.
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
            SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Login exitoso.',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                foto_perfil: usuario.foto_perfil
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { login };