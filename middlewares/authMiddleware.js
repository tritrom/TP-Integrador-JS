// Middleware de autenticación mediante JWT.
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'clave_secreta_desarrollo';

const verificarToken = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso denegado: no se recibió un token. Enviá "Authorization: Bearer <token>".'
        });
    }

    const token = header.split(' ')[1];
    try {
        // Verifica firma y expiración del token.
        const payload = jwt.verify(token, SECRET);
        req.usuario = payload; // El usuario autenticado queda disponible en la petición.
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = verificarToken;