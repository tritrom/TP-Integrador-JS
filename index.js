// 1. Importación de dependencias y módulos esenciales
const express = require('express'); // Framework principal para levantar nuestro servidor web [4, 5]
const path = require('path');       // Módulo nativo de Node.js para gestionar rutas de archivos
const fs = require('fs');           // Módulo nativo para interactuar con el sistema de archivos planos [7, 8]
require('dotenv').config();         // Carga de variables de entorno desde el archivo .env [2, 5]

// 2. Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Configuración dinámica del puerto mediante variables de entorno [2]

// 3. Middlewares integrados
app.use(express.json()); // Permite que nuestro servidor entienda y procese datos en formato JSON

// Configuración del middleware express.static() para servir archivos estáticos desde /public [6]
app.use(express.static(path.join(__dirname, 'public')));

// 4. Middleware de registro personalizado (Persistencia básica)
// Este middleware intercepta las visitas y registra los accesos en el archivo plano logs/log.txt [7, 8]
app.use((req, res, next) => {
    const logDirectory = path.join(__dirname, 'logs');
    const logFilePath = path.join(logDirectory, 'log.txt');
    
    // Asegurar que la carpeta 'logs' exista antes de escribir
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }

    // Obtener la fecha y hora local actual
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
    const rutaAccedida = req.originalUrl; // Captura la ruta exacta que visitó el usuario [7, 8]

    // Estructura de registro mínima exigida: fecha, hora y ruta accedida [8]
    const logEntry = `[${fecha} - ${hora}] Ruta accedida: ${rutaAccedida}\n`;

    // Escritura asíncrona no bloqueante sin sobrescribir registros previos [7, 8]
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error al escribir en el log:', err);
        }
    });

    next(); // Cede el control al siguiente middleware o ruta
});

// 5. Definición de las Rutas Públicas Exigidas [6]

// Ruta raíz (/) - Devuelve una respuesta estructurada en HTML [6]
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Servidor Iniciado</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; margin-top: 100px; background-color: #f0f4f8; color: #102a43; }
                h1 { color: #0b69a3; }
                .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>¡Servidor iniciado con éxito! 🚀</h1>
                <p>La Fase 1 del proyecto integrador está funcionando perfectamente.</p>
                <p>Rutas activas: <strong>/</strong> (HTML) y <strong>/status</strong> (JSON).</p>
            </div>
        </body>
        </html>
    `);
});

// Ruta de estado (/status) - Devuelve una respuesta estructurada en JSON [6]
app.get('/status', (req, res) => {
    res.json({
        status: "active",
        message: "El servidor Express está en línea y funcionando correctamente.",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date()
    });
});

// 6. Arranque del servidor y escucha de peticiones [1, 2]
app.listen(PORT, () => {
    // Imprime el mensaje en consola requerido para validar la inicialización [1]
    console.log(`Servidor iniciado de manera exitosa en el puerto: ${PORT}`);
});