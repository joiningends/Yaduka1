const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const userTable = sequelize.define("userTable", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  uid:{
    type: DataTypes.STRING,
    
   
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwords: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  terminate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  },
  
  userTypeId:{
    type: DataTypes.INTEGER,
    defaultValue: false,
    allowNull: true,
  }, 
  pwdverify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  
  divisionId:{
    type: DataTypes.INTEGER,
    
    allowNull: true,
  },
    roleId:{
      type: DataTypes.INTEGER,
    
      allowNull: true,
    },
    
    kycId:{
      type: DataTypes.INTEGER,
     
      allowNull: true,
    },
    bankId:{
      type: DataTypes.INTEGER,
      
      allowNull: true,
    },
    under: {
      type: DataTypes.INTEGER,
     
      allowNull: true,
    },
    
    companyname: {
      type: DataTypes.STRING,
      
      allowNull: true,
    },
    otp:{
      type: DataTypes.STRING,
     
      allowNull: true,
    },
    reqsitioncount:{
      type: DataTypes.INTEGER,
     
      allowNull: true,
    },
    contractcount:{
      type: DataTypes.INTEGER,
      
      allowNull: true,
    }
});

module.exports = userTable;
