const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const quality = sequelize.define('quality', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
     quality: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = quality;