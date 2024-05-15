const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const varient = sequelize.define("varient", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  varient: {
    type: Sequelize.STRING,
  },
  isImported: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cropDuration: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  farmable: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

module.exports = varient;
