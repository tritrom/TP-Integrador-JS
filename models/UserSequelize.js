// Modelo "Usuario" con Sequelize sobre la tabla existente "usuarios".
// Nombre de archivo sin colisión: evita conflicto case-insensitive con el modelo SQL (usuario.js).
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UsuarioSequelize = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    creado_en: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'usuarios',
    timestamps: false,
    underscored: true,
});

module.exports = UsuarioSequelize;