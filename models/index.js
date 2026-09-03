// Definición de relaciones entre modelos (Lección 6: Usuario tiene muchos Pedidos).
const Usuario = require('./Usuario');
const Pedido = require('./Pedido');

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = { Usuario, Pedido };