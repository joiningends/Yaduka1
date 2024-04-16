const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const party = sequelize.define("party", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  businessName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  brandMarka: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  contactPerson: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  mobileNumber: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  slNo: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isBlacklist: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

module.exports = party;
