const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const Reproduct = sequelize.define('reproduct', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  
  requireqty:{
    type: DataTypes.FLOAT,
    allowNull: false,
},

  deliveryQty: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue:0
  },
});

module.exports = Reproduct;
