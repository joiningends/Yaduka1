const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const Location = sequelize.define("Location", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  storagename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  under:{
   type: DataTypes.INTEGER,
    allowNull: false, 
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull:false
  }
});



module.exports =Location;
