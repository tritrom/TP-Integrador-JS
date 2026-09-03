// Controlador de la operación transaccional (registro de usuario + historial).
const transaccionService = require('../services/transaccionService');

// POST /api/transacciones/registro -> crea usuario y su historial de forma atómica.
async function registrarConHistorial(req, res, next) {
    try {
        const { nombre, email, saldo, tipo, monto, descripcion } = req.body;
        if (!nombre || !email) {
            return res.status(400).json({ error: 'Los campos nombre y email son obligatorios.' });
        }
        if (!tipo) {
            return res.status(400).json({ error: 'El campo tipo es obligatorio (ej: alta, deposito).' });
        }
        const resultado = await transaccionService.registrarUsuarioConHistorial({
            nombre, email, saldo, tipo, monto, descripcion
        });
        res.status(201).json(resultado);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email.' });
        }
        next(err);
    }
}

module.exports = { registrarConHistorial };