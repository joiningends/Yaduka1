const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Under = sequelize.define("Under", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  under:{
    type: DataTypes.INTEGER,
    
    allowNull: true,
  },
  locationunder:{
    type: DataTypes.INTEGER,
    
    allowNull: true,
  },
  
});

module.exports = Under;
