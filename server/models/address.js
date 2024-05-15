const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Address = sequelize.define("Address", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  GSTN: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SAC: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Address;
