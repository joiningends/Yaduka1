const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const SpaceType = sequelize.define("SpaceType", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
});

module.exports = SpaceType;
