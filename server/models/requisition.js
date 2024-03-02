const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const Requisition = sequelize.define('requisition', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // You might want to choose a more specific data type based on your requirements
    allowNull: false,
  },
  
});

module.exports = Requisition;
