// Middleware de registro de accesos (persistencia en archivo plano).
const path = require('path');
const fs = require('fs');

const logger = (req, res, next) => {
    const logDirectory = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logDirectory, 'log.txt');

    // Asegurar que la carpeta 'logs' exista antes de escribir.
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }

    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
    const rutaAccedida = req.originalUrl;

    const logEntry = `[${fecha} - ${hora}] Ruta accedida: ${rutaAccedida}\n`;

    // Escritura asíncrona no bloqueante sin sobrescribir registros previos.
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error al escribir en el log:', err);
        }
    });

    next();
};

module.exports = logger;