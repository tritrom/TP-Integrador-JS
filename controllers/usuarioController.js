// Controlador de las operaciones sobre usuarios.
const usuarioModel = require('../models/usuario');

// GET /usuarios -> lista todos los usuarios.
async function listar(req, res, next) {
    try {
        const usuarios = await usuarioModel.findAll();
        res.json({ total: usuarios.length, usuarios });
    } catch (err) {
        next(err);
    }
}

// POST /usuarios -> crea un nuevo usuario.
async function crear(req, res, next) {
    try {
        const { nombre, email, saldo } = req.body;
        if (!nombre || !email) {
            return res.status(400).json({ error: 'Los campos nombre y email son obligatorios.' });
        }
        const usuario = await usuarioModel.create({ nombre, email, saldo });
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, crear };