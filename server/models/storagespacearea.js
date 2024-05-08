const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const StoragespaceArea = sequelize.define("StoragespaceArea", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = StoragespaceArea;
