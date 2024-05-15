const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const BankDetails = sequelize.define("BankDetails", {
  accountname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IFSC: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accounttype: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = BankDetails;
