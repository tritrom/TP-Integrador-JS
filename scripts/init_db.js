// Script de inicialización de la base de datos.
// Uso: node scripts/init_db.js
// Requiere las credenciales de root en las variables de entorno DB_ROOT_* (no se guardan en el código).
require('dotenv').config();
const mysql = require('mysql2/promise');

const rootUser = process.env.DB_ROOT_USER || 'root';
const rootPassword = process.env.DB_ROOT_PASSWORD;

if (!rootPassword) {
    console.error('Falta DB_ROOT_PASSWORD. Definí la contraseña de root antes de ejecutar este script.');
    process.exit(1);
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function init() {
    // Conexión de administrador (root) sin seleccionar base de datos.
    const admin = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT) || 3306,
        user: rootUser,
        password: rootPassword
    });

    try {
        // 1. Crear la base de datos si no existe.
        await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

        // 2. Crear un usuario dedicado para la aplicación (no usar root).
        await admin.query(`CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}'`);
        await admin.query(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%'`);

        // 3. Crear la tabla principal "usuarios".
        await admin.query(`USE \`${DB_NAME}\``);
        await admin.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Base de datos, usuario de aplicación y tabla "usuarios" creados correctamente.');
    } finally {
        await admin.end();
    }
}

init().catch((err) => {
    console.error('Error al inicializar la base de datos:', err.message);
    process.exit(1);
});