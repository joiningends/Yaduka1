const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const GstRate = sequelize.define("GstRate", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
 
  percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
 
});

module.exports = GstRate;
