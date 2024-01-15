const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const commodityType = sequelize.define("commodityType", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  commodityType: {
    type: Sequelize.STRING,
    allowNull:true
  },
});

module.exports = commodityType;
