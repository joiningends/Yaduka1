const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const contract= sequelize.define("Contract", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  storagetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  renewaldays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contractstartdate:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  Gstapplicable:{
    type: DataTypes.BOOLEAN,
    allowNull: false, 
  },
  GstRate:{

  },
  Gsttype:{

  }
  });



module.exports = contract;
