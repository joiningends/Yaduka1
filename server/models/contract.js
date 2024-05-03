const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const party = require("../models/party");
const userTable = require("../models/user");

const contract = sequelize.define("Contract", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  storagetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  renewaldays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contractstartdate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Gstapplicable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  slno: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nextinvoicedate: {
    type: DataTypes.DATE,

    allowNull: true,
  },
  nextRentalAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = contract;
