const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('teamyaduka', 'teamyadukauser', 'Teamyaduka@321#', {
    host: '3.111.17.100',
    dialect: 'mysql',
    port: 3306,
  });
  
  
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database Connection is ready...');
      
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
    module.exports = sequelize;