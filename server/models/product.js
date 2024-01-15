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
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantifiedBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  newUnit:{
    type:Sequelize.STRING,
    allowNull:true
  }
});

module.exports = product;
