// 1. Importación de dependencias y módulos esenciales
const express = require('express'); // Framework principal para levantar nuestro servidor web [4, 5]
const path = require('path');       // Módulo nativo de Node.js para gestionar rutas de archivos
require('dotenv').config();         // Carga de variables de entorno desde el archivo .env [2, 5]

const pool = require('./config/db');          // Pool de conexiones a MySQL [mysql2]
const sequelize = require('./config/sequelize'); // Instancia de Sequelize (ORM)
require('./models');                           // Carga y asocia los modelos (Usuario, Pedido)
const logger = require('./middlewares/logger'); // Logger de accesos (archivo plano)
const usuariosRoutes = require('./routes/usuarios'); // Rutas de la entidad usuarios
const transaccionesRoutes = require('./routes/transacciones'); // Rutas transaccionales
const ormRoutes = require('./routes/orm');     // Rutas con Sequelize
const authRoutes = require('./routes/auth');   // Rutas de autenticación (login + JWT)
const uploadRoutes = require('./routes/upload'); // Rutas de subida de archivos

// 2. Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Configuración dinámica del puerto mediante variables de entorno [2]

// 3. Middlewares integrados
app.use(express.json()); // Permite que nuestro servidor entienda y procese datos en formato JSON

// Middleware de registro de accesos (persistencia en logs/log.txt)
app.use(logger);

// Configuración del middleware express.static() para servir archivos estáticos desde /public [6]
app.use(express.static(path.join(__dirname, 'public')));

// Montaje de las rutas de la entidad "usuarios" [mysql2]
app.use('/api/usuarios', usuariosRoutes);

// Montaje de las operaciones transaccionales [lección 4]
app.use('/api/transacciones', transaccionesRoutes);

// Montaje de las rutas que usan Sequelize (ORM) [lección 5 y 6]
app.use('/api/orm', ormRoutes);

// Montaje de las rutas de autenticación (login y JWT) [módulo 8]
app.use('/api', authRoutes);

// Montaje de las rutas de subida de archivos [módulo 8]
app.use('/api', uploadRoutes);

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
async function iniciarServidor() {
    try {
        // Verifica la conexión a la base de datos antes de ponerse en línea [mysql2]
        const conectado = await pool.query('SELECT 1');
        if (conectado) {
            console.log('Conexión a la base de datos MySQL establecida correctamente.');
        }

        // Verifica la conexión del ORM (Sequelize) [lección 5]
        await sequelize.authenticate();
        console.log('Conexión a la base de datos mediante Sequelize (ORM) establecida correctamente.');
    } catch (err) {
        console.error('No se pudo conectar a la base de datos:', err.message);
        console.error('Verificá que MySQL esté en ejecución y que las credenciales en .env sean correctas.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        // Imprime el mensaje en consola requerido para validar la inicialización [1]
        console.log(`Servidor iniciado de manera exitosa en el puerto: ${PORT}`);
    });
}

// Middleware de manejo centralizado de errores.
app.use((err, req, res, next) => {
    // Errores de multer: archivo demasiado grande o tipo no permitido (respuestas 400 amigables).
    if (err && (err.name === 'MulterError' || err.code === 'LIMIT_FILE_SIZE')) {
        return res.status(400).json({ error: err.message || 'Error al subir el archivo.' });
    }
    if (err && err.message && err.message.includes('no permitido')) {
        return res.status(400).json({ error: err.message });
    }
    // Body con JSON malformado.
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.', detalle: err.message });
});

iniciarServidor();