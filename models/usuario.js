// Modelo de la entidad "usuarios" y sus consultas a la base de datos.
const pool = require('../config/db');

// Devuelve todos los usuarios.
async function findAll() {
    const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id');
    return rows;
}

// Crea un nuevo usuario y devuelve el registro insertado.
async function create({ nombre, email, saldo }) {
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, email, saldo) VALUES (?, ?, ?)',
        [nombre, email, saldo ?? 0]
    );
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [result.insertId]);
    return rows[0];
}

module.exports = { findAll, create };