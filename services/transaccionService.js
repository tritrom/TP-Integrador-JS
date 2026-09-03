// Servicio de transacción: registra un usuario y crea su historial de forma atómica.
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

// Registra en un archivo plano las transacciones fallidas (similar a logs/log.txt).
function registrarTransaccionFallida(detalle) {
    const logDirectory = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logDirectory, 'transacciones_fallidas.txt');
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
    const ahora = new Date();
    const entrada = `[${ahora.toLocaleDateString()} - ${ahora.toLocaleTimeString()}] TRANSACCION FALLIDA: ${detalle}\n`;
    fs.appendFile(logFilePath, entrada, (err) => {
        if (err) console.error('Error al escribir log de transacción fallida:', err);
    });
}

// Ejecuta una operación atómica:
//  1. Inserta el usuario.
//  2. Inserta un registro en su historial.
// Si cualquiera de los dos pasos falla, se hace rollback y no queda el usuario a medias.
async function registrarUsuarioConHistorial({ nombre, email, saldo, tipo, monto, descripcion }) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Acción 1: crear el usuario.
        const [usuarioResult] = await connection.query(
            'INSERT INTO usuarios (nombre, email, saldo) VALUES (?, ?, ?)',
            [nombre, email, saldo ?? 0]
        );
        const usuarioId = usuarioResult.insertId;

        // Acción 2: crear el historial asociado.
        await connection.query(
            'INSERT INTO historial (usuario_id, tipo, monto, descripcion) VALUES (?, ?, ?, ?)',
            [usuarioId, tipo, monto ?? 0, descripcion]
        );

        await connection.commit();

        const [usuario] = await connection.query(
            'SELECT id, nombre, email, saldo, creado_en FROM usuarios WHERE id = ?',
            [usuarioId]
        );

        console.log(`[TRANSACCIÓN OK] Usuario ${usuarioId} creado con historial.`);
        return {
            exito: true,
            usuario: usuario[0],
            historial: { usuario_id: usuarioId, tipo, monto: monto ?? 0, descripcion }
        };
    } catch (err) {
        await connection.rollback();
        const detalle = `${err.message} | accion=registrarUsuarioConHistorial email=${email}`;
        registrarTransaccionFallida(detalle);
        console.error(`[TRANSACCIÓN FALLIDA] Rollback ejecutado. ${detalle}`);
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = { registrarUsuarioConHistorial };