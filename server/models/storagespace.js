const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const Storagespace = sequelize.define("Storagespace", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = Storagespace;
