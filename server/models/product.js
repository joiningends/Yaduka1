const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  packSize: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  length: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  height: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  width: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  quantifiedBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  newUnit: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = product;
