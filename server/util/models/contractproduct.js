const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const ContractProduct = sequelize.define("ContractProduct", {
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
  lotno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ContractProduct;
