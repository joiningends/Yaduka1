const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Signature = sequelize.define("Signature", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // Assuming you'll store the image as a URL or file path
    allowNull: false,
  }
});

module.exports = Signature;
