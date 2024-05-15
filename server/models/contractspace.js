const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const ContractSpace = sequelize.define('ContractSpace', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  qty: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
});

module.exports = ContractSpace;
