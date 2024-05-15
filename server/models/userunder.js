const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const userTable = require("../models/user");
const UserUnder = sequelize.define("UserUnder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = UserUnder;
