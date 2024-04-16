// Import Sequelize and DataTypes
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");

// Define the Invoice model
const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath :{
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Export the Invoice mod
module.exports = Invoice;
