// Modelo "Pedido" con Sequelize sobre la tabla "pedidos".
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    estado: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'pendiente',
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'pedidos',
    timestamps: false,
    underscored: true,
});

module.exports = Pedido;