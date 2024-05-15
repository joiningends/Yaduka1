const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const size = sequelize.define('size', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
     size: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = size;