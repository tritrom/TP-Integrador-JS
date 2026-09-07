// Script de inicialización de la base de datos.
// Uso: node scripts/init_db.js
// Requiere las credenciales de root en las variables de entorno DB_ROOT_* (no se guardan en el código).
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const rootUser = process.env.DB_ROOT_USER || 'root';
const rootPassword = process.env.DB_ROOT_PASSWORD;

if (!rootPassword) {
    console.error('Falta DB_ROOT_PASSWORD. Definí la contraseña de root antes de ejecutar este script.');
    process.exit(1);
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Verifica si una columna existe en una tabla (para migraciones idempotentes).
async function existeColumna(conn, tabla, columna) {
    const [rows] = await conn.query(
        `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [DB_NAME, tabla, columna]
    );
    return rows[0].n > 0;
}

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

        await admin.query(`USE \`${DB_NAME}\``);

        // 3. Crear la tabla principal "usuarios".
        await admin.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                password VARCHAR(255) NULL,
                foto_perfil VARCHAR(255) NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 4. Migración: agregar columnas faltantes (módulo 8) si la tabla ya existía.
        if (!(await existeColumna(admin, 'usuarios', 'password'))) {
            await admin.query('ALTER TABLE usuarios ADD COLUMN password VARCHAR(255) NULL');
            console.log('Columna password agregada a usuarios.');
        }
        if (!(await existeColumna(admin, 'usuarios', 'foto_perfil'))) {
            await admin.query('ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255) NULL');
            console.log('Columna foto_perfil agregada a usuarios.');
        }

        // 5. Crear la tabla "historial" (para transacciones y relaciones de la lección 6).
        await admin.query(`
            CREATE TABLE IF NOT EXISTS historial (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT UNSIGNED NOT NULL,
                tipo VARCHAR(50) NOT NULL,
                monto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                descripcion VARCHAR(255),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_historial_usuario
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 6. Tabla "pedidos" para la relación 1:N de la lección 6.
        await admin.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT UNSIGNED NOT NULL,
                descripcion VARCHAR(255) NOT NULL,
                total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_pedidos_usuario
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // 7. Datos simulados (al menos 3 usuarios) si la tabla está vacía.
        const [cuenta] = await admin.query('SELECT COUNT(*) AS n FROM usuarios');
        if (cuenta[0].n === 0) {
            await admin.query(`
                INSERT INTO usuarios (nombre, email, saldo) VALUES
                ('Juan Perez', 'juan@test.com', 150.50),
                ('Maria Gomez', 'maria@test.com', 320.00),
                ('Carlos Ruiz', 'carlos@test.com', 87.25)
            `);
            console.log('Se insertaron 3 usuarios de ejemplo.');
        }

        // 8. Usuario demo para autenticación (módulo 8): admin@test.com / Admin123!
        const [demo] = await admin.query('SELECT id FROM usuarios WHERE email = ?', ['admin@test.com']);
        if (demo.length === 0) {
            const hash = await bcrypt.hash('Admin123!', 10);
            await admin.query(
                'INSERT INTO usuarios (nombre, email, saldo, password) VALUES (?, ?, ?, ?)',
                ['Administrador Demo', 'admin@test.com', 0, hash]
            );
            console.log('Usuario demo creado: admin@test.com (password: Admin123!)');
        }

        console.log('Base de datos, tablas, usuario de aplicación y datos simulados listos.');
    } finally {
        await admin.end();
    }
}

init().catch((err) => {
    console.error('Error al inicializar la base de datos:', err.message);
    process.exit(1);
});