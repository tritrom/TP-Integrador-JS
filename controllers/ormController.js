// Controlador que usa Sequelize (ORM) para consultar usuarios.
const pool = require('../config/db'); // sql manual (para comparación)
const { Usuario, Pedido } = require('../models'); // ORM

// GET /api/orm/usuarios -> devuelve usuarios usando métodos del ORM.
async function listarConORM(req, res, next) {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'saldo', 'creado_en'],
            order: [['id', 'ASC']],
        });
        // Sequelize devuelve instancias; las serializamos a JSON plano.
        const json = usuarios.map((u) => u.toJSON());
        res.json({ metodo: 'orm', total: json.length, usuarios: json });
    } catch (err) {
        next(err);
    }
}

// Comparación de resultados entre SQL manual y ORM (requisito L5).
async function compararResultados(req, res, next) {
    try {
        // Toda la consulta SQL manual (como en la Lección 2).
        const [sqlRows] = await pool.query(
            'SELECT id, nombre, email, saldo, creado_en FROM usuarios ORDER BY id'
        );

        // Misma consulta con Sequelize.
        const ormRows = (await Usuario.findAll({ order: [['id', 'ASC']] })).map((u) => u.toJSON());

        const normalizar = (r) => ({
            id: Number(r.id),
            nombre: r.nombre,
            email: r.email,
            saldo: Number(r.saldo),
            creado_en: r.creado_en instanceof Date
                ? r.creado_en.toISOString()
                : String(r.creado_en),
        });

        const coinciden = JSON.stringify(sqlRows.map(normalizar).sort((a, b) => a.id - b.id))
            === JSON.stringify(ormRows.map(normalizar).sort((a, b) => a.id - b.id));

        res.json({
            mensaje: 'Comparación entre SQL manual y ORM (Sequelize).',
            resultadosCoinciden: coinciden,
            totalRegistros: sqlRows.length,
            sqlManual: sqlRows,
            orm: ormRows,
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/orm/usuarios/:id/pedidos -> usuario con sus pedidos (include L6).
async function usuarioConPedidos(req, res, next) {
    try {
        const id = Number(req.params.id);
        const usuario = await Usuario.findByPk(id, {
            attributes: ['id', 'nombre', 'email', 'saldo'],
            include: [{ model: Pedido, as: 'pedidos' }],
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(usuario.toJSON());
    } catch (err) {
        next(err);
    }
}

module.exports = { listarConORM, compararResultados, usuarioConPedidos };