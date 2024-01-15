const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const unit = sequelize.define('unit', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
     unit: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = unit;