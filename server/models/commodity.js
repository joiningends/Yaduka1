const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const commodity = sequelize.define("commodity", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  commodity: {
    type: Sequelize.STRING,
    allowNull:true
  },
  image: {
    type: Sequelize.STRING,
    allowNull:true
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull:false
  }
});

module.exports = commodity;
