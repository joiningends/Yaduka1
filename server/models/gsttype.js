const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const GstType = sequelize.define("GstType", {
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
});

module.exports = GstType;
