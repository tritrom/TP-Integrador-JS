// Modelo de la entidad "usuarios" y sus consultas a la base de datos.
const pool = require('../config/db');

// Devuelve todos los usuarios, opcionalmente filtrados por nombre.
async function findAll({ nombre } = {}) {
    const filtro = nombre ? 'WHERE nombre LIKE ?' : '';
    const params = nombre ? [`%${nombre}%`] : [];
    const [rows] = await pool.query(
        `SELECT id, nombre, email, saldo, creado_en FROM usuarios ${filtro} ORDER BY id`,
        params
    );
    return rows;
}

// Devuelve un usuario por su id.
async function findById(id) {
    const [rows] = await pool.query(
        'SELECT id, nombre, email, saldo, creado_en FROM usuarios WHERE id = ?',
        [id]
    );
    return rows[0];
}

// Crea un nuevo usuario y devuelve el registro insertado.
async function create({ nombre, email, saldo }) {
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, email, saldo) VALUES (?, ?, ?)',
        [nombre, email, saldo ?? 0]
    );
    return findById(result.insertId);
}

// Actualiza los campos indicados de un usuario existente.
async function update(id, { nombre, email, saldo }) {
    const campos = [];
    const params = [];

    if (nombre !== undefined) { campos.push('nombre = ?'); params.push(nombre); }
    if (email !== undefined) { campos.push('email = ?'); params.push(email); }
    if (saldo !== undefined) { campos.push('saldo = ?'); params.push(saldo); }

    if (campos.length === 0) return { afectados: 0 };

    params.push(id);
    const [result] = await pool.query(
        `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
        params
    );
    return { afectados: result.affectedRows };
}

// Elimina un usuario por su id.
async function remove(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return { eliminados: result.affectedRows };
}

module.exports = { findAll, findById, create, update, remove };