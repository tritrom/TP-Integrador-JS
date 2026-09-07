// Controlador de subida de archivos.
const usuarioModel = require('../models/usuario');

// POST /api/upload -> guarda el archivo en public/uploads y devuelve su ruta pública.
async function subirArchivo(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo (campo "archivo").' });
        }
        const urlPublica = `/uploads/${req.file.filename}`;
        res.status(201).json({
            mensaje: 'Archivo subido correctamente.',
            archivo: {
                nombreOriginal: req.file.originalname,
                ruta: urlPublica,
                mimetype: req.file.mimetype,
                tamaño: req.file.size
            }
        });
    } catch (err) {
        next(err);
    }
}

// POST /api/upload/perfil/:id -> sube un archivo y lo asocia como foto de perfil del usuario.
async function subirFotoPerfil(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo (campo "archivo").' });
        }

        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const usuario = await usuarioModel.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const urlPublica = `/uploads/${req.file.filename}`;
        const actualizado = await usuarioModel.updateFotoPerfil(id, urlPublica);

        res.status(201).json({
            mensaje: 'Foto de perfil actualizada.',
            usuario: actualizado
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { subirArchivo, subirFotoPerfil };