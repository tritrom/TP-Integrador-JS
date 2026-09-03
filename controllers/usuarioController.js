// Controlador de las operaciones sobre usuarios.
const usuarioModel = require('../models/usuario');

// GET /api/usuarios -> lista usuarios (opcional filtro por ?nombre=).
async function listar(req, res, next) {
    try {
        const { nombre } = req.query;
        const usuarios = await usuarioModel.findAll({ nombre });
        res.json({ total: usuarios.length, usuarios });
    } catch (err) {
        next(err);
    }
}

// GET /api/usuarios/:id -> devuelve un usuario por id.
async function obtenerUno(req, res, next) {
    try {
        const usuario = await usuarioModel.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(usuario);
    } catch (err) {
        next(err);
    }
}

// POST /api/usuarios -> crea un nuevo usuario.
async function crear(req, res, next) {
    try {
        const { nombre, email, saldo } = req.body;
        if (!nombre || !email) {
            return res.status(400).json({ error: 'Los campos nombre y email son obligatorios.' });
        }
        if (saldo !== undefined && Number.isNaN(Number(saldo))) {
            return res.status(400).json({ error: 'El saldo debe ser numérico.' });
        }
        const usuario = await usuarioModel.create({ nombre, email, saldo });
        res.status(201).json({ mensaje: 'Usuario creado con éxito.', usuario });
    } catch (err) {
        // Duplicado de email (error 1062 de MySQL)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email.' });
        }
        next(err);
    }
}

// PUT /api/usuarios/:id -> actualiza un usuario existente.
async function actualizar(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const existe = await usuarioModel.findById(id);
        if (!existe) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const { nombre, email, saldo } = req.body;
        if (saldo !== undefined && Number.isNaN(Number(saldo))) {
            return res.status(400).json({ error: 'El saldo debe ser numérico.' });
        }

        const { afectados } = await usuarioModel.update(id, { nombre, email, saldo });
        const actualizado = await usuarioModel.findById(id);
        res.json({
            mensaje: afectados > 0
                ? 'Usuario actualizado con éxito.'
                : 'No se aplicaron cambios (campos sin valores o idénticos).',
            usuario: actualizado
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email.' });
        }
        next(err);
    }
}

// DELETE /api/usuarios/:id -> elimina un usuario existente.
async function eliminar(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const existe = await usuarioModel.findById(id);
        if (!existe) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        await usuarioModel.remove(id);
        res.json({ mensaje: 'Usuario eliminado con éxito.', id });
    } catch (err) {
        next(err);
    }
}

module.exports = { listar, obtenerUno, crear, actualizar, eliminar };