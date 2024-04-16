const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const SpaceDetails = sequelize.define("SpaceDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    space: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    under: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breadth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rentable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  
 
  module.exports = SpaceDetails;
